import axios from "axios";

const targetUrl = `${process.env.TARGET_URL}`;

describe("smoke", () => {
  it("persistence-service status is 200", async () => {
    console.log(`Accessing target URL: ${targetUrl}`);
    
    const response = await axios.get(`http://${targetUrl}`);
    
    console.log(`Received status: ${response.status}`);
    console.log(`Received data: ${response.data}`);
    
    expect(response.status).toBe(200);
    expect(response.data).toBe("Road Freight Transportation company");
  });
});
