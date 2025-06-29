import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [open, setopen] = useState(false);
  const [open2, setopen2] = useState(null);

  const [Flist, setFlist] = useState(initialFriends);

  function AddFriend(friend) {
    setFlist((friends) => [...friends, friend]);
    setopen(false);
  }

  function handleOpen() {
    setopen((open) => !open);
  }

  function handlSelection(friend) {
    //setopen2(friend);
    setopen2((cur) => (cur?.id === friend.id ? null : friend)); //optional chaining is used bcz we dont know that cur always has a value
    setopen(false);
  }

  function handleFinalSplit(value) {
    setFlist((friends) =>
      friends.map((friend) =>
        friend.id === open2.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setopen2(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <List friends={Flist} op={open2} HD={handlSelection} />

        {open && <AddFriendForm AD={AddFriend} />}

        <Button onClick={handleOpen}>{open ? "close" : "ADD"}</Button>
      </div>
      {open2 && <FriendBillSplit selected={open2} HSF={handleFinalSplit} />}
    </div>
  );
}

function List({ friends, HD, op }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend friend={friend} key={friend.id} HD={HD} OP={op} />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, HD, OP }) {
  const isopened = OP?.id === friend.id;
  return (
    <>
      <li>
        <img src={friend.image} alt={friend.name} />
        <h4>{friend.name}</h4>
        {friend.balance < 0 && (
          <p className="red">
            you owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}
          </p>
        )}

        {friend.balance === 0 && <p>you and {friend.name} are even</p>}
        <Button onClick={() => HD(friend)}>
          {isopened ? "Close" : "select"}
        </Button>
      </li>
    </>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriendForm({ AD }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const Newfriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    AD(Newfriend);
    setname("");
    console.log(Newfriend);
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handleAddFriend}>
        <span>🧍🏻FRIEND</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <span>📸 IMAGE</span>{" "}
        <input
          type="url"
          value={image}
          onChange={(e) => setimage(e.target.value)}
        />
        <Button>ADD</Button>
      </form>
    </div>
  );
}

function FriendBillSplit({ selected, HSF }) {
  const [amouunt, setamount] = useState("");
  const [mybill, setmybill] = useState("");
  const Frdbill = amouunt ? amouunt - mybill : "";
  const [whopay, setwhopay] = useState("user");

  function handleSplit(e) {
    e.preventDefault();
    if (!amouunt || !mybill) return;
    HSF(whopay === "user" ? Frdbill : -mybill);
  }

  return (
    <>
      <form className="form-split-bill" onSubmit={handleSplit}>
        <h2>Split a bill with {selected.name} </h2>
        <label>Bill Value</label>
        <input
          type="number"
          value={amouunt}
          onChange={(e) => setamount(Number(e.target.value))}
        />

        <label>Your Expense</label>
        <input
          type="number"
          value={mybill}
          onChange={(e) =>
            setmybill(
              Number(e.target.value) > amouunt ? mybill : Number(e.target.value)
            )
          }
        />

        <label>{selected.name} Share</label>
        <input type="number" disabled value={Frdbill} />

        <label>Whos Gonna Pay</label>
        <select value={whopay} onChange={(e) => setwhopay(e.target.value)}>
          <option value="you">You</option>
          <option value="friend">{selected.name}</option>
        </select>
        <Button>Split Bill</Button>
      </form>
    </>
  );
}

export default App;
