# Example Challenge

This challenge serves as an example for the layout of a challenge directory and metadata.

## File Structure

Keeping in mind that once the challenge is released all files are visible to the public, you can put anything in the directory.
The only 2 requirements are that the `metadata.json` file follows the specification as displayed below, and it contains a `WRITEUP.MD` which is outlined below.

## `WRITEUP.MD`

The purpose of this file is to allow moderators to sort through valid

## `metadata.json`

An example of this JSON file is the following

```json
{
  "version": 1,
  "title": "Example Challenge",
  "authors": [
    {
      "name": "HexF",
      "link": "https://hexf.me/"
    }
  ],
  "flag": {
    "sha256": "05d235e21b85e8d3d62cea7cc69e2f3491f17582c1fda26deefa23b591726d7d"
  }
}
```

### Annotations

Below are annotaions using `jq` selectors

#### `.version`

Metadata Version

Currently should always be `1`

- Type: number

#### `.title`

Challenge Title

This can be anything you want, don't spoil the entire challenge.

- Type: string

#### `.flag.sha256`

Flag in SHA256

This is a representation of the flag in SHA256 form. The flag should be a string following the format `STEGO{a_string_without_spaces}` inclusive of the `{}`

- Type: string

#### `.flag.moderator`

Access to the flag for moderators.

This is the flag encrypted with the moderation public key. This is primarily used for unlocking the `WRITEUP.MD` file when checking for if challenges are solvable
