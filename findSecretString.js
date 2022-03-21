const findSecretString = (triplets) => {
	if (triplets.length === 0) {
		return "";
	}

	// transform triplets ["h", "a", "p"] into letters in pairs [["h", "a"], ["a", "p"]];
	const lettersInPairs = triplets.reduce((letterInPairs, triplet) => {
		return [...letterInPairs, [triplet[0], triplet[1]], [triplet[1], triplet[2]]];
	}, []);

	// set up an array to store the pairs we have checked
	const pairsValidated = [];

	// set up an array to store the pairs we haven't checked
	const pairsToValidate = lettersInPairs;

	// set up an array to store the result and default to include the first pair
	const secret = lettersInPairs[0];

	for (let index = 1; index < pairsToValidate.length; index++) {
		const pair = pairsToValidate[index];
		const [firstLetter, secondLetter] = pair;
		// check if the both letter has been added
		// if both letters are not in the secret
		if (!secret.includes(firstLetter) && !secret.includes(secondLetter)) {
			// we add the pair to the rules we haven't checked
			pairsToValidate.push(pair);
		}
		// if the first letter is in the secret
		else if (secret.includes(firstLetter) && !secret.includes(secondLetter)) {
			// we add the second letter immediately after the first letter
			secret.splice(secret.indexOf(firstLetter) + 1, 0, secondLetter);
			// AND add the pair to the rules we have been checked
			pairsValidated.push(pair);
		}
		// if the second letter is in the secret
		else if (secret.includes(secondLetter) && !secret.includes(firstLetter)) {
			// we add the first letter immediately before the second letter
			secret.splice(secret.indexOf(secondLetter), 0, firstLetter);
			// AND add the pair to the rules we have been checked
			pairsValidated.push(pair);
		}
		// both letters are in the secret
		else {
			// we check if our current array follow the expected order
			if (secret.indexOf(firstLetter) < secret.indexOf(secondLetter)) {
				// if so, continue AND add the pair to the rules we have been checked
				pairsValidated.push(pair);
			} else {
				// set up an array to keep track of letter we moved
				const lettersMoved = [];

				const moveSecondLetterInFront = (firstLetter, secondLetter, secret, lettersMoved) => {
					// we move the second letter to immediately in front the first letter
					secret.splice(secret.indexOf(firstLetter), 1);
					secret.splice(secret.indexOf(secondLetter), 0, firstLetter);
					// AND add the pair to the rules if we haven't done so already
					!pairsValidated.includes([firstLetter, secondLetter]) && pairsValidated.push([firstLetter, secondLetter]);
					// AND add the letter to the array of letter we moved
					lettersMoved.push(firstLetter);

					for (let index = 0; index < lettersMoved.length; index++) {
						const letterMoved = lettersMoved[index];
						// AND we started checking the rules we have checked so far that include the second letter
						pairsValidated.forEach((pairValidated) => {
							if (pairValidated.includes(letterMoved)) {
								const [firstLetterInRule, secondLetterInRule] = pairValidated;
								// if rule is NOT met, we move the letter
								if (secret.indexOf(firstLetterInRule) > secret.indexOf(secondLetterInRule)) {
									moveSecondLetterInFront(firstLetterInRule, secondLetterInRule, secret, lettersMoved);
								}
							}
						});
						// after checking all the rules are still met, we removed the letter
						lettersMoved.splice(lettersMoved.indexOf(secondLetter), 1);
					}
				};

				do {
					moveSecondLetterInFront(firstLetter, secondLetter, secret, lettersMoved);
				} while (lettersMoved.length !== 0);
			}
		}
	}

	return secret.join("");
};

module.exports = findSecretString;
