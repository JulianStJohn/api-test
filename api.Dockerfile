FROM openjdk:20-slim
WORKDIR /
COPY apichallenges.jar /apichallenges.jar
CMD java -jar apichallenges.jar
EXPOSE 4567 