import { Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by a user
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(dbId, collectionId, [
      Query.equal("searchTerm", query),
    ]);
    console.log(result);
  
    // check if a record of that search has already been stored
  
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(dbId, collectionId, existingMovie.id, {
        //   if document is found,increment the search count
        count: existingMovie.count + 1,
      });
    }
    //if no document is found, create a new document in Appwrite database -> 1
    else {
      await database.createDocument(dbId,collectionId,ID.unique(),{
        searchTerm:query,
        movie_id:movie.id,
        count:1,
        title:movie.title,
        poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
};
