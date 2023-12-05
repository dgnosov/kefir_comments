import {QueryClient, QueryClientProvider} from "react-query";
import Layout from "./layout/Layout";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Layout />
            </div>
        </QueryClientProvider>
    );
}

export default App;
