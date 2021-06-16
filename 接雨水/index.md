## 接雨水
题目描述：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

### 示例1:
![avatar](./rainwatertrap.png)
```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
```

### 示例2:
```
输入：height = [4,2,0,3,2,5]
输出：9
```



### 题目解析
思路：从左到右遍历每一个柱子，当前柱子所在列能接的水 = min(maxLeft, maxRight) - 当前柱子高度



#### 解法1：
1. 先从右边到作遍历，用一个数组存储每一个柱子右边柱子的最大高度
2. 从左向右线性处理，遍历过程中获得当前柱子左侧的柱子最大高度，用左侧柱子最大高度与右侧柱子最大共度计算当前柱子能接水的容量
```c++
class Solution {
public:
    int trap(vector<int>& height) {
        int size = height.size();
        vector<int> rightMax(size, 0);
        // 计算每个柱子右侧最大
        for(int i = size - 2; i >=0; i--) {
            rightMax[i] = max(rightMax[i+1], height[i+1]);
        }
        // 计算每个柱子左侧最大并线性求和
        int leftMax = 0;
        int minMax;
        int ans = 0;
        for(int i = 0; i < size - 1; i++) {
            minMax = min(leftMax, rightMax[i]);
            if(height[i] < minMax) {
                ans += minMax - height[i];
            }
            leftMax = max(leftMax, height[i]);
        }
        return ans;
    }
};
```


**解法二：双指针**
左右线性计算，max小的一边先计算并移动

```c++
class Solution {
public:
    int trap(vector<int>& height) {
        int size = height.size();
        int left = 0, right = size - 1;
        int leftMax = 0;
        int rightMax = 0;
        int ans = 0;
        while(left < right) {
            leftMax = max(leftMax, height[left]);
            rightMax = max(rightMax, height[right]);
            if(leftMax < rightMax) {
                ans += leftMax - height[left];
                left++;
            }else{
                ans += rightMax - height[right];
                right--;
            }
        }
        return ans;
    }
};
```
