This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Considerations

- The app is built using the [Vidstack](https://vidstack.io) framework. It has some small issues that I had to patch. Given the requirements for this project, Using a lightweight player worked best, but ideally Mux would be used as a video player, as it has much richer support. Youtube videos are fully supported, but there may be bugs with other platforms.
- Playlists are the next ideal feature to implement, but they were not completed due to time limitations and API schema.
- Pagination and lazy loading are not implemented due to API and time limitations.