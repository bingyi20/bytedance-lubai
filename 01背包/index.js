
/**
 * 
 * @param {Number} W 背包容量
 * @param {Number} N 物品数量 
 * @param {Number} wt 物品重量 
 * @param {Number} val 物品价值 
 * 经典版： 时间复杂度：O(WN), 空间复杂度：O(WN)
 */
function knapsack(W, N, wt = [], val = []) {
    const dp = Array.from(new Array(N+1), () => new Array(W+1).fill(0));
    for(let i = 1; i <= N; i++) {
        for(let j = 1; j <= W; j++) {
            if(j < wt[i-1]) {
                dp[i][j] = dp[i-1][j];
            }else{
                dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j-wt[i-1]] + val[i-1]);
            }
        }
    }
    return dp[N][W];
}

/**
 * 
 * @param {Number} W 背包容量
 * @param {Number} N 物品数量 
 * @param {Number} wt 物品重量 
 * @param {Number} val 物品价值 
 * 进阶版： 时间复杂度：O(WN), 空间复杂度：O(W)
 */
function knapsack1(W, N, wt = [], val = []) {
    const dp = new Array(W+1).fill(0);

    for(let i = 1; i <= N; i++) {
        for(let j = W; j > 0; j--) {
            if(j >= wt[i-1]) {
                dp[j] = Math.max(dp[j], dp[j-wt[i-1]]+val[i-1]);
            }
        }
        console.log(dp)
    }
    return dp[W];
}
const N = 3, W = 4;
const wt = [2, 1, 3];
const val = [4, 2, 3];
console.log("什么都没有输出吗？")
console.log(knapsack1(W, N, wt, val))