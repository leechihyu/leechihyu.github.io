---
title:  "Interesting Probability & Statistics Problems"
mathjax: true
layout: post
author: Chih-Yu
categories: media
---  

---
<span style="font-family:Times New Roman">This notebook documents some of the interesting statistics and probability problems I encountered. Solving these problems may require some thinking, and sometimes inspiration. Once getting familiar with the general thinking manner, we may find they are not as challenging as they appear to be. I add some annotations below the questions with the hope to give you some quick hints. Hope you will like the notebook.<br>
The notebook is not going to be updated regularly, as I am busy in other important tasks.<br>

--- 
 
### <center>Expected Number </center> <br>
#### <mark> Reduce to simpler cases </mark> <br>
__Connecting noodles__<br>
You have 100 noodles in your soup bowl. Being blindfolded, you are told to take two ends of some noodles (each end on any noodle has the same probability of being chosen) in your bowl and connect them. You continue util there are no free ends. The number of loops formed by the noodles this way is stochastic. Calculate the expected number of circles. <br>
_(Prac. Guid. for Quant, p93)_<br>
__Comment:__ <span style="color:red"> Questions like this usually seem to be very complicate with a large number. However, we could start from some simpler cases. In this case, simple cases could provide much inspiration for solving the problem. Moreover, we can also find that complex cases could be reduced to simpler ones.</span><br>
__Takeaway:__ <br>
- 1. Start from simple cases <br>
- 2. Reduce the complex ones to simpler ones <br>

__Solution:__ Let's start from the simplest case where there is only 1 noodle. The expected number for it is 1. Without loss of generality, let's denote with $$e_n$$ the expected number of circles formed by the noodles. For 2 noodles, there are $$(^{4}_{2})$$ different combinations of end, and 2 of them make a noodle forming a circle alone. Thus, $$e_2 =2\times\frac{2}{6} + 1\times\frac{4}{6}=\frac{4}{3}$$. Let's look further, the relationship between $$e_n$$ and $$e_{n+1}$$ is that we can break all cases of $$n+1$$ into two categories. The first one is we can make one of the noodles to form a circle itself, and the rest $$n$$ noodles has an expected number of $$e_n$$. The second is we can make two of the noodles to connect forming one noodle, and the problem is again reduced to the problem of $$n$$ noodles. We can write the relationship as follow:<br>
$$e_{n+1}=\frac{n+1}{C_{2n+2}^{2}}(e_n+1)+(1-\frac{n+1}{C_{2n+2}^{2}})e_n=\frac{1}{2n+1} + e_n$$.
Finally, we get $$e_{100}=\sum_{n=0}^{99}\frac{1}{2n+1}$$.<br>

__Approximation:__<br>
_(Harmonic Series)_ $$1+\frac{1}{2}+\frac{1}{3}+...\approx ln(2n)+\lambda$$, where $$\lambda$$ is Euler constant, $$\lambda\approx 0.577$$.<br>
_(Partial Harmonic)_ $$\sum_{n}^{i}\frac{b}{a+(i-1)b}\approx \frac{1}{d}ln(\frac{2a+(2n-1)d}{2a-d})$$. <br>

---

__Coupon collection__<br>
There are N distinct types of coupons in cereal boxes and each type, independent of prior selections, is equally likely to be in a box.<br>
A. If a child wants to collect a complete set of coupons with at least one of each type, how many coupons (boxes) on average are needed to make such a complete set?<br>
B. If the child has collected n coupons, what is the expected number of distinct coupon types?<br>
_(Prac. Guid. for Quant, p93)_<br>
__Comment:__ <span style="color:red">We can solve the question in the similar style as the previous one:</span>
- Start from simple cases
- Reduce the problem into smaller ones. <br>

__Solution:__ <br>
__A.__<br>
We start with $$N=2$$, as $$N=1$$ is a trivial case. The question now is that given we have got a coupn _A_, what is the expected number to get coupon _B_. Let's again denote the expected number to be $$E$$, then $$E=\frac{1}{2}+\frac{1}{2}(1+E)$$. We get $$E=2$$. And the expected number of getting 2 different coupons under the given condition is 3. What about $$N=3$$? If $$N=3$$, we may consider the expected number of getting a coupon different from what we already have. $$E=\frac{2}{3}+\frac{1}{3}(1+E)$$. We get $$E=\frac{3}{2}$$. The number is $$\frac{3}{2}+1$$. So far, we have got two different coupons, what is the expected number of getting the left coupon? $$E=\frac{1}{3}+\frac{2}{3}(1+E)$$. We get $$E=3$$. To sum up, the result is $$3+\frac{3}{2} + 1$$. The analysis shows that we can get the result step by step.<br>
If we have $N-1$ different coupons, what is the expected number of getting the left one? $$E=\frac{1}{N}+\frac{N-1}{N}(1+E)$$. We get the final result to be $$\frac{N}{N}+\frac{N}{N-1}+...+\frac{1}{N}=N(1+\frac{1}{2}+...\frac{1}{N})\approx N(ln(2N)+0.557)$$.<br>
__B.__<br>
Let's consider from a simple case where $$n=2$$. With a coupon in hand, the probability of the another coupon being the same is $$\frac{1}{N}$$. Thus the expected number is $$1+\frac{N-1}{N}$$. For simplicity, we define a variable $$X_i$$ such that 
$$X_i=1$$ if $$X_i\neq X_j j = 1,2,..i-1$$ else $$X_i=0$$. We have $$1+\frac{N-1}{N}E_{n-1}=E_n$$<br>
We have $$\frac{E_n-N}{E_{n-1}-N}=\frac{N-1}{N}$$. Then $$E_n=N+(1-N)(\frac{N-1}{N})^{n-1}$$. <br>

---
 
__Dice game__<br>
Suppose that you roll a dice. For each roll, you are paid the face value. If a roll gives 4, 5, or 6, you can roll the dice again. Once you get 1, 2, or 3, the game stops. What is the expected payoff of this game?<br>
_(Prac. Guid. for Quant, p94)_<br>
__Comment:__ <span style="color:red"> We can take the situations where we get a 4, 5 or 6 as a renewal case where all setups are initialised.</span><br>
__Takeaway:__ Renewal process. <br>

__Solution:__ Let's denote the expected payoff with $$E$$. If we get 4, 5 or 6 in the first roll, we can roll the dice again and we come back to the initial point which is exactly the same as the original state. Thus we have the expected payoff to be $$\frac{1}{6}(4+5+6+3E)$$. If we get 1,2 or 3, the game stops and no more payoff. The expected payoff is $$\frac{1}{6}(1+2+3)$$. To sum them up, we have $$E=\frac{1}{6}(21+3E)$$. We can get $$E=7$$. <br>

---

__Repeated application__<br>
Let R(n) be a random draw of integers between 0 and n − 1 (inclusive). I repeatedly apply R, starting at $$10^{100}$$. What’s the expected number of repeated applications until I get zero?<br>
_(G-Research)_<br>
__Comment:__ <span style="color:red"> Still, we can start from a simple case and then proceed to more complicate cases.</span><br>

__Solution:__ Let's denote the expected number of getting zero from $$n$$ with $$Q_n$$. We have the base case $$Q_0=1$$. And we can easily get $$Q_1=\frac{1}{2}+\frac{1}{2}(Q_1+1)$$. We have $$Q_2=\frac{1}{3}+\frac{1}{3}(Q_1+1)+\frac{1}{3}(Q_2+1)$$<br>
We have $$Q_n=\frac{1}{n+1}(n+1+\sum_{i=1}^{n}Q_i)=1+\frac{1}{n+1}\sum_{i=1}^{n}Q_i$$. Further, we can get $$Q_n-Q_{n-1}=\frac{1}{n}$$ with some algebra from the original equation.<br>
$$Q_n=1+1+\frac{1}{2}+\frac{1}{3}+...+\frac{1}{n}\approx 1+ln(2n)+0.577$$.<br>
Finally, we can get an approximate result 233. <br>

---
 
#### <mark> Define a variable </mark> <br>
__Card game__<br>
What is the expected number of cards that need to be turned over in a regular 52-card deck in order to see the first ace.<br>
_(Prac. Guid. for Quant, p95)_<br>
__Comment:__ <span style="color:red"> The question is a little bit tricky. If we sovlve the problem the the aforementioned method to relate different states, we can get a relationship formula. However, it seems not to be very easy to solve. Instead, we may conseider the problem as getting the expected position of a certain card, whose position follows a uniform distribution.</span><br>
__Takeaway:__ Transform the problem into a familiar one. <br>

__Solution:__ In expected case, the four cards are uniformly positioned. Thus the interval between them should be equal, say $$\frac{48}{5}=9.6$$. The expected number of cards to be turned over is 10.6. <br>

---
 
__Average number of matches__<br>
A typist types letters and envelopes to $$n$$ different persons. The letters are randomly put into the envelopes. On the average, how many letters are put into their own envelopes?<br>
_(Challenge of Prob, p11)_<br>
__Comment:__<span style="color:red">The question is similar to __Card games__ above in spirit. The question asks for the expected number of a finite set of cases. We can simply observe each of the case and find some ideas.</span><br>
__Takeaway:__ 
- Figure out the probability of each case. <br>

__Solution:__ Let's denote the variable of envelope $$i$$ to be correctly put with $$X_i$$, $$X_i=1$$ if correctly put otherwise $$X_i=0$$. Then we need to figure out the probability. The probability of $$X_i$$ to be correctly put is related with two events: a) the letter has not been put into envelopes; b) we luckily choose the correct letter to put into the envelope. Therefore, the probability is $$P(X_i=1)\frac{n-i-1}{n}\times\frac{1}{n-i-1}=\frac{1}{n}$$. $$E(X_1+...+X_n)=E(X_1)+...+E(X_n)=n\times\frac{1}{n}=1$$. <br>

---
 
#### <mark>Geometry related </mark> <br>
__Dashboard problem__<br>
A dart is thrown at a circular dart board of radius one. The dart can land at any place on the dartboard with equal probability. What is the mean distance between where the dart hits and the center of the board?<br>
_http://mathproblems.info/working.php#17_ <br>
<p align="center">
<img src="../image/Prob&Stats/img1.png" width="400" height="300"/>
</p>

__Solution:__ The question is quite straightforward, that we can simply adopt the defintion of expectation to calculate the mean distance.<br>
$$E(X) = \int_{0}^{1}xf(x)$$, where $$x$$ is the distance between the hit and the center. The only problem left is that we should get the probability density function of $$x$$. We can easily get the probability function $$F(x)=P(X<x)=\frac{\pi x^{2}}{\pi r^2}=x^{2}$$. To take the derivative of $$F(X)$$, we get the PDF $$f(x)=2x$$. Plug the PDF in the formula of expectation and get $$E(x)=\int_{0}^{1}2x^2dx=\frac{2}{3}x^{3}|^{1}_{0}=\frac{2}{3}.$$ <br>

---
 
__The broken bar__<br>
A bar is broken at random in two places. Find the average size of the smallest, of the middle-sized, and of the largest pieces.<br>
_(Challenge of Prob & G-Research)_<br>
__Comment:__ <span style="color:red"> I attempted for many times with a method which conditioning on a piece and then select a random point to break the other piece into two. It seems to be reasonable but it is not easy to handle, because I have to deal with conditional probability. A more straightforward and easy way is to randomly select to breaking points and deal with the problem.</span><br>

__Solution:__ Suppose there are two breaking points $$X$$ and $$Y$$ which follow uniform distribution and seperate the bar into three. We let $$X$$ to be the leftmost point the $$Y$$ to be the rightmost point. The lengths of the three pieces of bar are $$X$$, $$Y-X$$ and $$1-Y$$ respectively.<br>
__tbc__ <br>

---
 
__The Sum Over 1 Problem__<br>
On average, how many random draws from the interval [0,1] are necessary to ensure that their sum exceeds 1?<br>
Comment:<span style='color:red'>This proble would be easy if we know Irwin-Hall distribution. But we can still work it out without knowing it.</span><br>

__Solution:__ We can write down the formula of expectation directly and get:<br>
<center>$$E(n)=P(n=1)+2\times P(n=2)+3\times P(n=3)+...$$</center><br>
<center>$$=P(X1\ge 1)+2\times P(X1< 1, X1+X2\ge 1)+3\times P(X1+X2< 1, X1+X2+X3\ge 1)+...$$</center><br>
<center>$$=1+P(X1\le 1)+P(X1+X2\le 1)+...P(X1+...+Xn\le 1)$$</center>.<br>
By observing the formula, we know the probability terms correspond to the volume of n-dimensional unit simplex, which is given by $$\frac{1}{n!}$$. The probability for $$P(X1+...+Xn<1)$$ is $$1-\frac{1}{n!}$$.<br>
$$E(n)=\sum_{1}^{\infty}\frac{1}{n!}=e$$. <br>

--- 
 
### <center>Probability</center> <br>
__Random walk__ <br>
__The cliff-hanger__<br>
From where he stands, one step toward the cliff would send the drunken man over the egde. He takes random steps, either toward or away from the cliff. At any step his probability of taking a step away if $$\frac{2}{3}$$, of a step toward the cliff is $$\frac{1}{3}$$. What is the chance of escaping the cliff?<br>
_(Chanllenge of Prob, p51)_<br>
__Comment:__<span style="color:red">This is the simplest case for random walk problems, and is one of the most important ones. With the conclusion obtained from this problem, we can further solve some more complicate ones.</span> <br>

<p align="center">
<img src="../image/Prob&Stats/img2.png" width="400" height="150"/>
</p>
__Solution:__ The drunken man has a probability of $$1-p$$ to arrive at the edge in one step and a probability of $p$ to arrive at point 2 in one step. Let's denote the probabilty of the drunken man arrive at the edge finally from point $i$ with $$Q_i$$. Then $$Q_1=1-p+pQ_2$$. The drunken man has a probability of $$Q_1$$ to finally arrive at point 1 from point 2 for the first time, because the question has the same structure as the previuos one. Now, the problem has been reduced to a question which is exactly the same as the original one. Thus, $$Q_2=Q_1\times Q_1$$. We can solve a equation of $$Q_1$$ and get $$Q_1=1, Q_1=\frac{1-p}{p}$$. If $$p<\frac{1}{2}$$, we can take $$Q_1=1$$ and take $$Q_1=\frac{1-p}{p}$$ otherwise. Let substitute the symbol with real number given by the question, $$p=\frac{2}{3}$$, which is greater than $$\frac{1}{2}$$. Therefore, the probability of the drunken man arriving at the edge is $$\frac{1}{2}$$. The chance of escaping from the edge is $$\frac{1}{2}$$. <br>

--- 
 
__Gambler's ruin__<br>
Player $$M$$ has 1 USD, and Player $$N$$ has 2 USD. Each play gives one of the players 1 USD from the other. Player $$M$$ is enough better than Player $$N$$ that he wins $$\frac{2}{3}$$ of the plays. They play until one is bankrupt. What is the chance that Player $$M$$ wins? <br>

__Comment:__ This problem is a more compilicate version of the previous one, and is a variant. With the conclusion obtained from the previous question, we have the probability of $$M$$ loses the game if $$N$$ has infinite number of money to be $$\frac{1-\frac{2}{3}}{\frac{2}{3}}=\frac{1}{2}$$. However, in this case, $$N$$ has finite number of money, say 2 USD. We denote the probability of $$M$$ loses the game with $$Q$$. $$\frac{1}{2}=Q+(1-Q)(\frac{1}{2})^{3}$$. To explain $$Q$$ in detail, $$Q$$ is the probability that a point starting from point 1 idling between 0 and 3 (exclusive) and finally ending at 0. $$1-Q$$ is the probability that the point starting from 1 and idling between 0 and 3 and reach 3 once. We need to multiply 1-$$Q$$ with the probability that it finally ends up with point 0. We can get $$Q=\frac{3}{7}$$. The chance that $$M$$ wins the game is $$\frac{4}{7}$$.

---

__Bertrand Paradox__<br>
Determine the probability that a random chord of a circle of unit radius has a length greater than the square root of 3, the side of an inscribed equilateral triangle.<br>

Recommended Resources:<br>
1. Numberphile, & 3blue1brown (Directors). (2021, December 20). Bertrand’s Paradox (with 3blue1brown)—Numberphile. https://www.youtube.com/watch?v=mZBwsm6B280
2. 李永乐 (Director). (n.d.). 神奇的伯特兰悖论：一道概率题竟然有三个不同的答案！. https://www.youtube.com/watch?v=62tL_BEY1no
 
---
 
 _Reference_ <br>
- G-Research. (2017). Sample Quant Exam. G-Research. https://www.gresearch.co.uk/wp-content/uploads/2019/12/Sample-Quant-Exa.pdf <br>
- Mosteller, F. (1987). Fifty Challenging Problems in Probability With Solutions. Dover Publications. <br>
- Shackleford, M. (n.d.). Dartboard problem #1. Mathproblems.Info. http://mathproblems.info/working.php#17 <br>
- Zhou, X. (2008). A Practical Guide to Quantitative Finance Interviews (1st ed.). http://www.quantfinanceinterviews.com
