export async function wordScore(name, word, score) {
  console.log(name);
    const response = await fetch(
      `/wordScore?player=${name}&word=${word}&score=${score}`,
      {
        method: 'POST',
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  }

  export async function gameScore(name, score) {
    const response = await fetch(
      `/gameScore?player=${name}&score=${score}`,
      {
        method: 'POST',
      }
    );
    const data = await response.json();
    return data;
  }
  
  export async function highestWordScores() {
    const response = await fetch(`/highestWordScores`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  }

  export async function highestGameScores() {
    const response = await fetch(`/highestGameScores`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  }
  