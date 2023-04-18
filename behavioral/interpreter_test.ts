import { emit, format, parse, Process, tokenize } from "./interpreter.ts";
import { assertEquals } from "std/testing/asserts.ts";

type Code = string;
type Input = string;
type Output = string;
type TestCase = [Code, Input, Output];

function stringToCharCodes(s: string): Array<number> {
  const charCodes: Array<number> = [];
  for (let i = 0; i < s.length; i++) {
    charCodes.push(s.charCodeAt(i));
  }
  return charCodes;
}

const helloWorld = [
  "++++++++                ", // Set Cell #0 to 8
  "[",
  "    >++++               ", // Add 4 to Cell #1; this will always set Cell #1 to 4
  "    [                   ", // as the cell will be cleared by the loop
  "        >++             ", // Add 2 to Cell #2
  "        >+++            ", // Add 3 to Cell #3
  "        >+++            ", // Add 3 to Cell #4
  "        >+              ", // Add 1 to Cell #5
  "        <<<<-           ", // Decrement the loop counter in Cell #1
  "    ]                   ", // Loop until Cell #1 is zero; number of iterations is 4
  "    >+                  ", // Add 1 to Cell #2
  "    >+                  ", // Add 1 to Cell #3
  "    >-                  ", // Subtract 1 from Cell #4
  "    >>+                 ", // Add 1 to Cell #6
  "    [<]                 ", // Move back to the first zero cell you find; this will
  "                        ", // be Cell #1 which was cleared by the previous loop
  "    <-                  ", // Decrement the loop Counter in Cell #0
  "]                       ", // Loop until Cell #0 is zero; number of iterations is 8

  // The result of this is:
  // Cell no :   0   1   2   3   4   5   6
  // Contents:   0   0  72 104  88  32   8
  // Pointer :   ^

  ">>.                     ", // Cell #2 has value 72 which is 'H'
  ">---.                   ", // Subtract 3 from Cell #3 to get 101 which is 'e'
  "+++++++..+++.           ", // Likewise for 'llo' from Cell #3
  ">>.                     ", // Cell #5 is 32 for the space
  "<-.                     ", // Subtract 1 from Cell #4 for 87 to give a 'W'
  "<.                      ", // Cell #3 was set to 'o' from the end of 'Hello'
  "+++.------.--------.    ", // Cell #3 for 'rl' and 'd'
  ">>+.                    ", // Add 1 to Cell #5 gives us an exclamation point
  ">++.                    ", // And finally a newline from Cell #6
].join("\n");

const rot13 = [
  "-,+[                       ", // Read first character and start outer character reading loop
  "  -[                       ", // Skip forward if character is 0
  "      >>++++[>++++++++<-]  ", // Set up divisor (32) for division loop
  "                           ", //   (MEMORY LAYOUT: dividend copy remainder divisor quotient zero zero)
  "      <+<-[                ", // Set up dividend (x minus 1) and enter division loop
  "          >+>+>-[>>>]      ", // Increase copy and remainder / reduce divisor / Normal case: skip forward
  "          <[[>+<-]>>+>]    ", // Special case: move remainder back to divisor and increase quotient
  "          <<<<<-           ", // Decrement dividend
  "      ]                    ", // End division loop
  "  ]>>>[-]+                 ", // End skip loop; zero former divisor and reuse space for a flag
  "  >--[-[<->+++[-]]]<[      ", //    Zero that flag unless quotient was 2 or 3; zero quotient; check flag
  "      ++++++++++++<[       ", // If flag then set up divisor (13) for second division loop
  "                           ", //   (MEMORY LAYOUT: zero copy dividend divisor remainder quotient zero zero)
  "          >-[>+>>]         ", // Reduce divisor; Normal case: increase remainder
  "          >[+[<+>-]>+>>]   ", // Special case: increase remainder / move it back to divisor / increase quotient
  "          <<<<<-           ", // Decrease dividend
  "      ]                    ", // End division loop
  "      >>[<+>-]             ", // Add remainder back to divisor to get a useful 13
  "      >[                   ", // Skip forward if quotient was 0
  "          -[               ", // Decrement quotient and skip forward if quotient was 1
  "              -<<[-]>>     ", // Zero quotient and divisor if quotient was 2
  "          ]<<[<<->>-]>>    ", // Zero divisor and subtract 13 from copy if quotient was 1
  "      ]<<[<<+>>-]          ", // Zero divisor and add 13 to copy if quotient was 0
  "  ]                        ", // End outer skip loop (jump to here if ((character minus 1)/32) was not 2 or 3)
  "  <[-]                     ", // Clear remainder from first division if second division was skipped
  "  <.[-]                    ", // Output ROT13ed character from copy and clear it
  "  <-,+                     ", // Read next character
  "]                          ", // End character reading loop
].join("\n");

const testCases: Array<TestCase> = [
  [helloWorld, "", "Hello World!\n"],
  [rot13, "Hello World!", "Uryyb Jbeyq!"],
];

Deno.test("identity", () => {
  for (const [code, _] of testCases) {
    const tokens = Array.from(tokenize(code));
    const nodes = Array.from(parse(tokens));
    assertEquals(format(tokens), code);
    assertEquals(Array.from(emit(nodes)), tokens);
  }
});

Deno.test("Process", () => {
  for (const [code, input, output] of testCases) {
    const program = parse(tokenize(code));
    const process = new Process(program, stringToCharCodes(input));
    assertEquals(process.execute().outputBuffer, stringToCharCodes(output));
  }
});
