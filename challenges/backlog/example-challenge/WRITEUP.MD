# Example Challenge

Well done! You completed the example challenge.
Incase you wanted to know how to do it again - here it is

## Method

1. Open the `challenge.svg` file with a text editor.
2. Grab all text between the SVG Comments `<!-- --->`
3. Your done!

## Automated Method

```bash
#$TEST$=STEGO{worldshardestsvgopen}
awk '/<!--/,/-->/' challenges/example-challenge/challenge.svg | sed -e 's/<!-- //g' -e 's/ -->//g' > $TESTOUTPUTFILE
```
