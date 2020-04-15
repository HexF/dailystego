# DailyStego

Daily steganography challenges delivered to your door\*

## The Game

DailyStego is a game all about extracting information. Everyday a brand new user contributed steganography challenge is published. Everyone competes to extract the flag from the file.

### Scoring

For every minute the challenge remains unsolved, it becomes worth 2 more points, starting from 100 points. Who ever takes first blood on this challenge takes gets awarded all the points, and the value of the challenge is reduced by 10%. After first blood, a challenges value is reduced by 1% every 10 minutes. As soon as the next challenge is released, this challenge becomes worth 10% of the value that was awarded at first blood, and stopping the decay.

This paragraph can be broken down into the following rules:

- While a challenge is unsolved, it gains a points value of 2 points every minute.
- When a challenge is solved for the first time, the player who solved the challenge is awarded the full value of the challenge. Subsequently the challenge loses 10% of its value.
- After a challenge is solved, the amount of points it is worth decays by 1% every 10 minutes
- Once a new challenge is released (24 hours after the previous one) the challenge gets a fixed amount of points, amounting to 10% of the value that was awarded on first blood.

An example is below

```
12:00PM - Challenge is released at a value of 100 Points
01:00PM - Challenge is now worth 220 Points
01:30PM - First blood is drawn at a value of 280 Points
        - Challenge is now worth 252 Points
        - User is awarded their  280 Points
02:00PM - Challenge is now worth 246 Points
10:00PM - Challenge is now worth 166 Points
-- New Day --
06:00AM - Challenge is now worth 102 Points
11:45AM - Challenge is now worth  78 Points

12:00PM - New Challenge is released at a value of 100 Points
        - Previous Challenge is now worth 28 Points

```

### Awards

Virtual badges will be issued to users for the following objectives:

- Taking First blood on a challenge
- Top 3 in the world for any given week.

These badges can be shown off on your profile, and be used as bragging rights.

### Playing

Make your way over to [the website](https://dailystego.hexf.me/) and download todays challenge, and some previous ones.

## Making a Challenge

This part requires geek-foo. I'll assume you have some.

Run `npm run mkchallenge` and fill our the prompts. Pretty self explainitory.

Now make your way over to the challenge directory that was setup for you, in my case it was `/home/thomas/Projects/dailystego/challenges/backlog/pngu`

In this folder you want to put your challenge file, in my case `challenge.png`

In this file, make sure to some how embed your flag that you either made yourself, or had generated.

Now that your challenge is made up, you will need to write a `WRITEUP.MD` on how to solve it, and maybe fill in some testing scripts\*\*.
Make sure your writeup covers how to solve the test, remember: moderators will be reading and following it!

Now that your challenge is all assembled, time to pack and upload it.
To do this run `node run seal` and pass your flag into the program.

Now commit this tar.gz file to git, and make a PR to the master repo `HexF/dailystego`

## Donate

Enjoy the challenges? Great, I'm glad you like them.

Currently I haven't exceeded my Netlify limits on the free plan, but I expect them to go over eventually.

If you have the extra change, sponsoring me on GitHub will help keep these limits under control. No donation is required, but it is very much appreciated and will help DailyStego stay alive.

Sponsoring will earn you an exclusive badge for every month.

If you want to sponsor the whole project, drop me an email at thomas@hexf.me and we can discuss it

## Disclaimer

\* Not physically delivered to your door

\*\* Not currently implemented, you can write tests, but they wont run currently.
