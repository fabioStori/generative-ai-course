import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

public class Main {
    public static void main(String[] args) {
        // Define an array of numbers
        int[] numbers = {1, 3, 4, 2, 5};

        // Initialize variables to store the sum, maximum, and minimum values
        int sum = 0;
        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;

        // Iterate over the array and update the sum, maximum, and minimum values
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];

            if (numbers[i] > max) {
                max = numbers[i];
            }

            if (numbers[i] < min) {
                min = numbers[i];
            }
        }

        // Print the sum, maximum, and minimum values
        System.out.println("Sum: " + sum);
        System.out.println("Maximum: " + max);
        System.out.println("Minimum: " + min);

        // Create a copy of the array and sort it in ascending order
        int[] sortedAscending = numbers.clone();
        Arrays.sort(sortedAscending);

        // Create a copy of the array and sort it in descending order
        int[] sortedDescending = numbers.clone();
        Arrays.sort(sortedDescending, Collections.reverseOrder());

        // Print the sorted arrays
        System.out.println("Sorted in ascending order: " + Arrays.toString(sortedAscending));
        System.out.println("Sorted in descending order: " + Arrays.toString(sortedDescending));
    }
}
