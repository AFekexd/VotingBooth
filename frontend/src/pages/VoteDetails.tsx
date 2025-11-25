import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import type { Vote } from '../utils/type';
import { getVoteById } from '../services/api';

const VoteDetails = () => {
    const {id} = useParams();
    const [vote, setVote] = useState<Vote>({} as Vote);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
          setLoading(true);
          const response = await getVoteById(id as string);
          console.log(response);
          setVote(response.data);
          setLoading(false)
        } catch (error) {
          console.error("Error fetching votes:", error);
        }
      };

      useEffect(() => {
        getData();
      }, []);


  return (
    <div>{id}</div>
  )
}

export default VoteDetails