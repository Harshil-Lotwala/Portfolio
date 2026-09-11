window.NAB_DATA = {
  customer: { name: "Alex Morgan", firstName: "Alex" },
  accounts: [
    { id: "chequing", name: "Everyday Chequing", number: "•• 2847", balance: 4826.42, icon: "wallet", tone: "blue" },
    { id: "savings", name: "High Interest Savings", number: "•• 6912", balance: 12480.75, icon: "vault", tone: "teal" },
    { id: "mastercard", name: "North Atlantic Mastercard", number: "•• 4281", balance: -1286.34, icon: "card", tone: "navy" },
    { id: "investments", name: "TFSA Investments", number: "Portfolio", balance: 17842.36, icon: "chart", tone: "slate" }
  ],
  card: { current: 1286.34, statement: 1112.84, available: 8713.66, limit: 10000, minimum: 45, due: "September 24" },
  transactions: [
    { id: "starbucks", merchant: "Starbucks", meta: "Today · Food & dining", amount: -6.82, account: "Everyday Chequing", status: "Completed", icon: "coffee", reference: "NAB-849218", location: "Halifax, NS", time: "8:14 AM" },
    { id: "payroll", merchant: "Dalhousie University", meta: "Yesterday · Income", amount: 1842.20, account: "Everyday Chequing", status: "Completed", icon: "building", reference: "NAB-849103", location: "Direct deposit", time: "6:00 AM" },
    { id: "walmart", merchant: "Walmart", meta: "Sep 18 · Shopping", amount: -84.16, account: "North Atlantic Mastercard", status: "Completed", icon: "bag", reference: "NAB-848996", location: "Halifax, NS", time: "5:42 PM" },
    { id: "hydro", merchant: "Nova Scotia Power", meta: "Sep 17 · Bills", amount: -118.47, account: "Everyday Chequing", status: "Completed", icon: "bolt", reference: "NAB-848712", location: "Pre-authorized", time: "12:01 AM" },
    { id: "interac", merchant: "Interac from Maya Chen", meta: "Sep 16 · Transfer", amount: 250.00, account: "Everyday Chequing", status: "Autodeposited", icon: "arrow-down", reference: "CA9H-4421", location: "Interac e-Transfer", time: "2:36 PM" },
    { id: "uber", merchant: "Uber", meta: "Sep 15 · Transportation", amount: -21.76, account: "North Atlantic Mastercard", status: "Completed", icon: "car", reference: "NAB-847921", location: "Halifax, NS", time: "10:18 PM" }
  ],
  recipients: [
    { id: "maya", name: "Maya Chen", detail: "maya.chen@example.com", initials: "MC", auto: true },
    { id: "liam", name: "Liam Patel", detail: "+1 902 555 0142", initials: "LP", auto: true },
    { id: "sophie", name: "Sophie Tremblay", detail: "sophie.t@example.com", initials: "ST", auto: false }
  ],
  payees: [
    { id: "power", name: "Nova Scotia Power", detail: "Account •• 7718", icon: "bolt" },
    { id: "mobile", name: "Eastlink Mobile", detail: "Account •• 2489", icon: "phone" },
    { id: "internet", name: "Bell Internet", detail: "Account •• 9032", icon: "wifi" },
    { id: "insurance", name: "Atlantic Insurance", detail: "Policy •• 6621", icon: "shield" }
  ],
  holdings: [
    { id: "xeqt", symbol: "XEQT", name: "iShares Core Equity ETF", quantity: 210.32, price: 33.18, value: 6978.42, gain: 8.4, tone: "blue" },
    { id: "vfv", symbol: "VFV", name: "Vanguard S&P 500 ETF", quantity: 54.21, price: 145.67, value: 7896.74, gain: 12.7, tone: "teal" },
    { id: "cash", symbol: "CASH", name: "High Interest Savings ETF", quantity: 59.22, price: 50.10, value: 2967.20, gain: 2.1, tone: "slate" }
  ],
  notifications: [
    { id: "n1", title: "Interac transfer received", body: "$250.00 from Maya Chen was deposited.", time: "2h", route: "transaction/interac", icon: "arrow-down", unread: true },
    { id: "n2", title: "Mastercard payment reminder", body: "$45.00 minimum payment is due September 24.", time: "5h", route: "card", icon: "card", unread: true },
    { id: "n3", title: "Upcoming bill", body: "Eastlink Mobile is scheduled for tomorrow.", time: "1d", route: "bills", icon: "calendar", unread: false },
    { id: "n4", title: "New device sign-in", body: "A sign-in from Safari on Mac was verified.", time: "2d", route: "security", icon: "shield", unread: false }
  ],
  spending: [
    { name: "Housing", value: 1480, pct: 42, color: "navy" },
    { name: "Food", value: 486, pct: 14, color: "blue" },
    { name: "Transportation", value: 292, pct: 8, color: "teal" },
    { name: "Bills", value: 354, pct: 10, color: "amber" },
    { name: "Shopping", value: 338, pct: 9, color: "slate" },
    { name: "Other", value: 596, pct: 17, color: "gray" }
  ],
  demo: { transferRecipient: "Maya Chen", transferAmount: 250, requestAmount: 80, billAmount: 96.45 }
};
