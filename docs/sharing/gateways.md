# Sharing: writing a gateway

A gateway makes the share listener reachable on one fixed public origin.

## The contract

A gateway implements `App\Sharing\Contracts\ShareGateway`:

- `readiness(GatewayConfiguration): GatewayReadiness`: each missing piece as a plain sentence for the owner; no
  problems means ready.
- `open(GatewayOperation): GatewayEndpoint`: start the program for the listener and return the endpoint once the
  program reports exactly the configured origin. Refuse any other origin with `GatewayOpenFailed`; never fall back to
  a random address.
- `health(GatewayEndpoint): GatewayHealth`: probe the origin. `App\Sharing\Gateways\Support\ChallengeProbe` fetches a
  single-use challenge through the origin over HTTPS, without redirects, from a host that resolves only to public
  addresses.
- `close(GatewayEndpoint)`: stop only the program this run started, through
  `App\Sharing\Gateways\Support\GatewayChildren`.

Check a reported origin with `App\Sharing\Gateways\Support\PublicOriginCheck`. Never repeat a line the program
printed: request paths carry tokens. Keep secrets out of command arguments and read them from
`App\Sharing\Gateways\Support\GatewaySecrets`.

`GatewayConfiguration` pins one settings revision; its `GatewaySettings` hold the gateway key, the program version,
the provider host, the public origin, the listener port and the names of the secrets. `GatewayOperation` carries the
supervisor's run, the endpoint version and the lease under which it acts.

## Registration

Core registers its own gateways, `tunler` and `ngrok`, in `App\Sharing\Providers\SharingServiceProvider`. A domain
brings its own by implementing `App\Sharing\Contracts\ShareGatewayProvider`, returning each key with its class. A key
registered twice stops the boot.

## Running a gateway

The supervisor calls a gateway outside every bus command and database transaction, in three steps: it claims an
operation in one committed command, runs the gateway's effect, and records the outcome in another committed command,
fenced by its run and lease. A stale or expired claim cannot activate anything.

## Visitor addresses

`App\Sharing\Support\SourceAddressRule` says how a gateway's forwarded requests name a visitor: `none()` ignores
forwarded headers, and `forHeader($name)` trusts one header only after a fixture proves the gateway overwrites it.
Every gateway uses `none()` today, so only the per-share and overall limits apply.
