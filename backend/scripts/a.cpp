// #include<bits/stdc++.h> 
// using namespace std; 
// using ll = long long; 
// #define all(x) (x).begin(), (x).end() 
 
// int main(){ 
//     ios::sync_with_stdio(false); 
//     cin.tie(nullptr); 
//     cout.tie(nullptr); 
 
//     int t; 
//     cin>>t; 
//     while(t--){ 
//         ll n,m,k; 
//         cin>>n>>m>> k; 
 
//         vector<bool>occupied(n +1, false); 
//         for(int i =0; i<m; i++){ 
//             int a; 
//             cin>>a; 
//             occupied[a] =true; 
//         } 
 
//         int ptr =1; 
//         for(int i= 0; i<k; i++){ 
//             while(ptr <= n && occupied[ptr])ptr++; 
//             occupied[ptr] = true; 
//             cout << ptr << " \n"[i ==k-1]; 
//         } 
//     } 
 
//     return 0; 
// }

#include<bits/stdc++.h> 
using namespace std; 
using ll = long long; 
#define all(x) (x).begin(), (x).end() 
const ll MOD = 998244353; 
const int MAXN = 200005; 
 
ll fact[MAXN]; 
ll power(ll b, ll e, ll m){ 
    ll r =1; 
    b %= m; 
    while(e >0){ 
        if(e &1)r =r * b% m; 
        b = b * b%m; 
        e >>=1; 
    } 
    return r; 
} 
int main(){ 
    ios::sync_with_stdio(false); 
    cin.tie(nullptr); 
    cout.tie(nullptr); 
 
    // fact[0]=1; 
    // for(int i=1; i<MAXN; i++){
    //     fact[i] = fact[i-1] * i % MOD;
    // }
 
    int t; 
    cin>>t; 
    while(t--){ 
        ll n, k; 
        cin>>n>>k; 
        for(int i = 0; i < n; i++){
            int x;
            cin>> x;
        } 
        cout<<power(k, n-k+1, MOD)*fact[k-1] % MOD<<endl; 
    } 
 
    return 0; 
}