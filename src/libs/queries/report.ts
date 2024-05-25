export const UserReporQuery = (coachId: number) => {
    return `Select
    "userDetails"."UserId" AS "id",
    "userDetails"."FirstName" AS "FirstName",
    "userDetails"."LastName" AS "LastName",
    "userDetails"."email" AS "email",
    CASE
     WHEN COALESCE("last10"."Max10days", 0) = 0 THEN 'No cravings'
     WHEN "last10"."Max10days" <= 2 THEN 'Light cravings'
     WHEN "last10"."Max10days" <= 6 THEN 'Moderate Cravings'
     ELSE 'Strong cravings'
 END AS "Status10Days",
    ROUND(COALESCE("last10"."Avg10days", 0),1) AS "Avg10days",
    ROUND(COALESCE("last3"."Avg3days", 0),1) AS "Avg3days",
    COALESCE("last1"."value", 0) AS "LastCraving",
    EXTRACT(DAY FROM TO_TIMESTAMP(TO_CHAR(CURRENT_DATE,'YYYY-MM-DD'), 'YYYY-MM-DD')-
          TO_TIMESTAMP(TO_CHAR(COALESCE("last1"."insertedAt",CURRENT_DATE), 'YYYY-MM-DD'),'YYYY-MM-DD')) AS "NoReport" 
 
    
 from
    (
       SELECT
          "Users"."id" AS "UserId",
       "coach"."coachId" AS "CoachId",
          "Users"."email" AS "email",
          "userdetails"."firstName" AS "FirstName",
          "userdetails"."lastName" AS "LastName",
          "userdetails"."firstName" AS "userdetails.firstName",
          "userdetails"."lastName" AS "userdetails.lastName" 
       
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
         Select entries."userId" AS "userId",AVG(entries."value") as "Avg10days",MAX(COALESCE(entries."value", 0)) as "Max10days" from (
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
         Select entries."userId" AS "userId",AVG(entries."value") as "Avg3days" from (
        SELECT "userId", "insertedAt", "value",
              rank() OVER (PARTITION BY "userId" ORDER BY "insertedAt" DESC) as "dayNumber"
          FROM "userMeasurement" ) as entries
         where entries."dayNumber"<=3
         group by "userId"
       )
       AS "last3" 
       on "userDetails"."UserId" = "last3"."userId"
      left outer join
       (
         Select entries."userId" AS "userId","insertedAt",entries."value" as "value" from (
        SELECT "userId", "insertedAt", "value",
              rank() OVER (PARTITION BY "userId" ORDER BY "insertedAt" DESC) as "dayNumber"
          FROM "userMeasurement" ) as entries
         where entries."dayNumber"=1
       )
       AS "last1" 
       on "userDetails"."UserId" = "last1"."userId"`
}