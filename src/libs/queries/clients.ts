
export const GetClientsQuery = (coachId: number ) =>{
   return  `
    Select
    "userDetails"."UserId" AS "Id",
	CONCAT("userDetails"."FirstName",' ',"userDetails"."LastName") AS "Name",
	"userDetails"."email" AS "Email",
	"userDetails"."LastClass" As "LastClass",
    CASE
     WHEN COALESCE("last10"."Max10days", 0) > 2 or
	 EXTRACT(DAY FROM TO_TIMESTAMP(TO_CHAR(CURRENT_DATE,'YYYY-MM-DD'), 'YYYY-MM-DD')-
          TO_TIMESTAMP(TO_CHAR(COALESCE("last1"."insertedAt",CURRENT_DATE), 'YYYY-MM-DD'),'YYYY-MM-DD')) > 3
	THEN 1::boolean
     ELSE 0::boolean
 END AS "Struggling"
 
 from
    (
       SELECT
          "Users"."id" AS "UserId",
       "coach"."coachId" AS "CoachId",
          "Users"."email" AS "email",
          "userdetails"."firstName" AS "FirstName",
          "userdetails"."lastName" AS "LastName",
		"classes"."isLast" As "LastClass"
       
       FROM
          "users" AS "Users" 
          LEFT OUTER JOIN
             "userDetails" AS "userdetails" 
             ON "Users"."id" = "userdetails"."userId" 
             AND 
             (
                "userdetails"."deletedAt" IS NULL 
             )
          INNER JOIN
             "assignedCoaches" AS "coach" 
             ON "Users"."id" = "coach"."userId" 
          INNER JOIN
             public."classesAssignedTo" 
             ON "classesAssignedTo"."userId" = "Users"."id" 
          INNER JOIN
             public."classes" 
             ON "classes"."id" = "classesAssignedTo"."classesId" 
       WHERE
          (
             "Users"."deletedAt" IS NULL
          )
          and "Users"."userTypeId" = 3 
             and "coach"."coachId" = ${coachId}
    )
    AS "userDetails" 
 
      
    left outer join
       (
         Select entries."userId" AS "userId",MAX(COALESCE(entries."value", 0)) as "Max10days" from (
        SELECT "userId", "insertedAt", "value",
              rank() OVER (PARTITION BY "userId" ORDER BY "insertedAt" DESC) as "dayNumber"
          FROM "userMeasurement" ) as entries
         where entries."dayNumber"<=10
         group by "userId"
       )
       AS "last10" 
       on "userDetails"."UserId" = "last10"."userId"
      
      left outer join
       (
         Select entries."userId" AS "userId","insertedAt",entries."value" as "value" from (
        SELECT "userId", "insertedAt", "value",
              rank() OVER (PARTITION BY "userId" ORDER BY "insertedAt" DESC) as "dayNumber"
          FROM "userMeasurement" ) as entries
         where entries."dayNumber"=1
       )
       AS "last1" 
       on "userDetails"."UserId" = "last1"."userId"
    `
}