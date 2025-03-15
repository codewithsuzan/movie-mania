import { Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by a user
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: any) => {
  const searchTerm = query.trim().toLowerCase();

  try {
    const result = await database.listDocuments(dbId, collectionId, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const existingDoc = result.documents[0];
      await database.updateDocument(dbId, collectionId, existingDoc.$id, {
        count: existingDoc.count + 1,
      });
    } else {
      await database.createDocument(dbId, collectionId, ID.unique(), {
        searchTerm: searchTerm,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};


export const getTrendingMovies=async():Promise<TrendingMovie[] | undefined>=>{
  try {
    const result = await database.listDocuments(dbId, collectionId, [
      Query.limit(5),
      Query.orderDesc('count')
    ]);
    return result.documents  as unknown as TrendingMovie[]
  } catch (error) {
    console.log(error)
    return undefined
  }
}