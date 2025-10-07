# Trade Requests Frontend Implementation

## 🎯 **Overview**

Complete frontend implementation for the Trade Requests system, allowing users to manage sent and received trade requests with proper status handling and user experience.

## 📁 **File Structure**

```
tradeship-frontend/src/
├── types/
│   ├── trade-request.ts          # Trade request type definitions
│   ├── api.ts                    # General API types
│   ├── user.ts                   # User types
│   ├── notification.ts           # Notification types
│   ├── wallet.ts                 # Wallet types
│   ├── item.ts                   # Item types
│   ├── chat.ts                   # Chat types
│   └── index.ts                  # Type exports
├── services/api/
│   └── trade-requests.ts         # Trade request API service
├── components/trade-request/
│   ├── trade-request-card.tsx    # Individual trade request card
│   ├── trade-request-card.module.scss
│   ├── trade-request-list.tsx    # List of trade requests
│   └── trade-request-list.module.scss
└── pages/trade-requests/
    ├── trade-requests.tsx        # Main trade requests page
    └── trade-requests.module.scss
```

## 🔧 **Key Features**

### **1. Smart Status Handling**

- **Sent Requests**: Show as "Sent" with cancel option for pending
- **Received Requests**: Show as "Pending" with accept/decline options
- **Status-based Actions**: Different actions based on request status and user role

### **2. Tabbed Interface**

- **Received Tab**: Trade requests you need to respond to
- **Sent Tab**: Trade requests you have sent
- **All Tab**: Complete overview of all trade requests

### **3. Rich Trade Request Cards**

- **User Information**: Avatar, username, and full name
- **Trade Details**: Visual representation of items being traded
- **Status Indicators**: Color-coded status badges
- **Action Buttons**: Context-aware action buttons
- **Message Display**: Optional trade request messages

### **4. Statistics Dashboard**

- **Pending Count**: Number of pending requests
- **Accepted Count**: Number of accepted requests
- **Sent Count**: Total sent requests
- **Real-time Updates**: Stats update when actions are taken

## 🎨 **UI/UX Design**

### **Status Colors**

- 🟡 **Pending**: Yellow/amber for waiting status
- 🟢 **Accepted**: Green for successful trades
- 🔴 **Declined**: Red for rejected requests
- ⚫ **Expired**: Gray for expired requests
- ⚫ **Cancelled**: Gray for cancelled requests

### **Action Buttons**

- **Accept**: Green button for accepting requests
- **Decline**: Red button for declining requests
- **Cancel**: Gray button for cancelling sent requests
- **View**: Blue button for viewing details

### **Responsive Design**

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Adapted layout for tablets
- **Desktop Enhancement**: Full-featured desktop experience

## 🔄 **Data Flow**

### **1. Trade Request Loading**

```typescript
// Load trade requests based on type
const loadTradeRequests = async (type: "sent" | "received" | "all") => {
  const response = await tradeRequestApi.getTradeRequests({ direction: type });
  return response.data.results;
};
```

### **2. Action Enhancement**

```typescript
// Enhance trade requests with action types
const enhanceTradeRequestWithActions = (tradeRequest, currentUserId) => {
  const isFromCurrentUser = tradeRequest.requester.id === currentUserId;

  let actionType: TradeRequestActionType = "none";

  if (isFromCurrentUser) {
    // User sent this request
    if (tradeRequest.status === "PENDING") {
      actionType = "cancel";
    } else {
      actionType = "view";
    }
  } else {
    // User received this request
    if (tradeRequest.status === "PENDING") {
      actionType = "accept";
    } else {
      actionType = "view";
    }
  }

  return { ...tradeRequest, actionType, isFromCurrentUser };
};
```

### **3. Real-time Updates**

```typescript
// Update stats and refresh lists after actions
const handleAccept = async (id: number) => {
  await tradeRequestApi.acceptTradeRequest(id);
  onTradeRequestUpdate?.(); // Refresh stats
  loadTradeRequests(1, false); // Reload list
};
```

## 🚀 **API Integration**

### **Endpoints Used**

- `GET /api/trade-requests` - Get all trade requests
- `GET /api/trade-requests/sent` - Get sent trade requests
- `GET /api/trade-requests/received` - Get received trade requests
- `GET /api/trade-requests/pending` - Get pending trade requests
- `GET /api/trade-requests/stats` - Get trade request statistics
- `POST /api/trade-requests/:id/accept` - Accept trade request
- `POST /api/trade-requests/:id/decline` - Decline trade request
- `DELETE /api/trade-requests/:id` - Cancel trade request

### **Error Handling**

- **Network Errors**: Graceful error messages
- **Validation Errors**: User-friendly error display
- **Loading States**: Spinner and skeleton loading
- **Empty States**: Helpful empty state messages

## 📱 **User Experience**

### **Navigation**

- **Header Link**: "Trade Requests" in main navigation
- **Route**: `/trade-requests` accessible to authenticated users
- **Breadcrumbs**: Clear navigation context

### **Interaction Flow**

1. **User visits `/trade-requests`**
2. **Sees tabbed interface with stats**
3. **Clicks on "Received" tab** → Sees pending requests
4. **Clicks "Accept" on a request** → Request is accepted
5. **Stats update automatically** → Shows new counts
6. **List refreshes** → Shows updated status

### **Accessibility**

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Clear focus indicators

## 🔧 **Technical Implementation**

### **TypeScript Types**

```typescript
export interface TradeRequestWithActions extends TradeRequest {
  actionType: TradeRequestActionType;
  isFromCurrentUser: boolean;
}

export type TradeRequestActionType =
  | "accept" // User can accept (received + pending)
  | "decline" // User can decline (received + pending)
  | "cancel" // User can cancel (sent + pending)
  | "view" // User can only view (sent + accepted/declined/expired)
  | "none"; // No actions available
```

### **Component Architecture**

- **TradeRequestCard**: Reusable card component
- **TradeRequestList**: List management with pagination
- **TradeRequests**: Main page with tabs and stats
- **Modular SCSS**: Component-scoped styles

### **State Management**

- **Local State**: Component-level state for UI
- **API State**: Server state management
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful error handling

## 🎯 **Key Benefits**

### **1. User Clarity**

- **Clear Status**: Users know exactly what they can do
- **Visual Hierarchy**: Important information is prominent
- **Action Context**: Buttons only appear when relevant

### **2. Efficient Workflow**

- **Tabbed Interface**: Quick access to different views
- **Bulk Actions**: Handle multiple requests efficiently
- **Real-time Updates**: Immediate feedback on actions

### **3. Mobile Optimized**

- **Touch-friendly**: Large buttons and touch targets
- **Responsive Layout**: Works on all screen sizes
- **Fast Loading**: Optimized for mobile networks

## 🔮 **Future Enhancements**

### **Potential Improvements**

- **Real-time Notifications**: WebSocket integration
- **Bulk Actions**: Select multiple requests
- **Advanced Filtering**: Filter by date, status, user
- **Search Functionality**: Search within trade requests
- **Export Options**: Export trade request history

### **Integration Opportunities**

- **Chat Integration**: Direct messaging from trade requests
- **Item Integration**: Link to item details
- **User Profiles**: Quick access to user profiles
- **Trade History**: Link to completed trades

---

## ✅ **Implementation Complete**

The Trade Requests frontend is now fully implemented with:

- ✅ Complete type definitions
- ✅ API service integration
- ✅ Reusable components
- ✅ Main page with tabs
- ✅ Navigation integration
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ User experience optimization

**Ready for testing and deployment!** 🚀
