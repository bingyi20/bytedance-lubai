## 01背包问题
01背包的问题描述：
有 n 种物品，物品 j 的重量为wj，价值为 vi，有一个承重为W。每种物品只有 1 个，只有选或者不选，而没有选几个的问题，此问题称为 01 背包问题。

举个简单的例子，输入如下：

N = 3(3个物品)， W = 4(背包容量)
wt = [2, 1, 3]
val = [4, 2, 3]
算法返回6，选择前两件物品装进背包，总重量 3 小于W，可以获得最大价值 6。

### 动态规划解题思路

1. 明确【状态】和【选择】
状态
i: 选择到第i件物品。
j: 背包剩余容量。

选择
装  :选择第i个物品
不装 :不选第i个物品

```
for i in [0...N]:
    for j in [0..W]:
        dp[i][j] = max(dp[i-1][j], dp[i-1][j - wt[i-1]] + val[i-1])
```

2. 明确dp数组的定义
dp[i][j] = 容量为j的背包前i个物品所能装的最大容量
dp[i][0] = 0
dp[0][j] = 0

3. 状态转移方程怎么写？
不装：dp[i][j] = dp[i-1][j]
装：  dp[i][j] = dp[i-1][j - wt[i-1]] + val[i-1]    j > wt[i-1]

4. 把伪代码转换成代码
    见index.js