'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Haseeb Ghaffar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {
containerMovements.innerHTML = '';
  //sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;


   movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
    `;

    //insert adjacent html adding movement to dom
    containerMovements.insertAdjacentHTML('afterbegin', html);
   });
}
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => mov + acc, 0);labelSumOut.textContent = `${Math.abs(out)}€`
  
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate/100).filter((int, i, arr) => {
    return int >= 1;
  }).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

const createUserNames = function(accs) {
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
createUserNames(accounts);

//Event handler login user
const updateUI = function(acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
}
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // clear th input fields 
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value ='';
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
    // doing transfer 
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    // add the movements
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // delete account 
    accounts.splice(index, 1);
    // hide UI 
    containerApp.style.opacity = 0;
  }
     // clear th input fields 
     inputCloseUsername.value = inputClosePin.value = '';
});

//sorting 
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// lecture 153
// filter method
// const deposit = movements.filter(function(mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);

// const depsitsFor = [];
// for(const mov of movements) if(mov > 0) depsitsFor.push(mov);
// console.log(depsitsFor);

// const withdrawal = movements.filter(function(mov){
//   return mov < 0;
// });
// console.log(withdrawal);

// const withdrawalFor = [];
// for(const mov of movements) if(mov < 0) depsitsFor.push(mov);
// console.log(withdrawalFor);

// lecture 154
// reduce method 
// const balance = movements.reduce(function(acc, cur, i, arr){
//   console.log(`ieration ${i}: ${acc}`);
//   return acc + cur
// }, 0);
// console.log(balance);
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);

// maximum value of the movement array
// const max = movements.reduce((acc, mov) => {
//   if(acc > mov)
//   return acc;
//   else(mov < acc)
//   return mov;
// }, movements[0]);
// console.log(max);


// lecture 155
//magic of chaining method

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// lecture 157
// find method 

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica.Davis');
// console.log(account);

// // lecture 161
// console.log(movements.includes(-130));
// const anyDeposits = movements.some(mov => mov >1500);
// console.log(anyDeposits);

// every method 
// console.log(movements.every(mov => mov >0));
// console.log(account4.movements.every(mov => mov >0));

// //seprate callback
// const deposit = mov => mov >0;
// console.log(movements.some(mov => mov >0));
// console.log(movements.every(mov => mov >0));
// console.log(movements.filter(mov => mov >0));

// lecture 162
// flat and flatMap 
// const arr= [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat());

// const arrDeep= [[[1,2],3],[4,[5,6]],7,8];
// console.log(arrDeep.flat());
// console.log(arrDeep.flat(2));

// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// lecture 163
// sorting(works on strings better and perfect for it)


//string
const owner = ['jonas', 'zach', 'any', 'only'];
console.log(owner.sort());
//number
console.log(movements);
console.log(movements.sort());

//assending order
// movements.sort((a, b) => {
//   if(a > b) return 1;
//   if(a < b) return -1;
// });
// console.log(movements);
// movements.sort((a, b) => a-b);
// console.log(movements);

// descending order 
// movements.sort((a, b) => {
//   if(a > b) return -1;
//   if(b < a) return 1;
// });

// movements.sort((a, b) => b-a);
// console.log(movements);

// lecture 164
// fill method + empty array
// const arr = ([1,2,3,4,5,6,7]);
// console.log(new Array(1,2,3,4,5,6,7));

// const x = new Array(7);
// console.log(x);

// // or we do 
// console.log(x.map(() => 5));
// x.fill(1, 3, 5);

// arr.fill(23, 4,6);
// console.log(arr);

// //form method
// const y = Array.from({length: 7}, () => 1);
// console.log(y);

// const z = Array.from({length: 7}, (_, i) => i + 1);
// console.log(z);
// labelBalance.addEventListener('click', function(){
  
// const movementsUI = Array.from(document.querySelectorAll('.movement_value')),

// console.log(movementsUI.map(el => el.textContent.replace('€', '')));
// });

