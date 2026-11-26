<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Contracts\Bus\Command;
use App\Support\EnrolledHost;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\HostContract;
use Tests\Support\Bus\ExpectedCommand;

/**
 * The call a route's entry test sends: who sends it, the route's parameters, the query and payload, and the commands
 * the route is expected to send on; a recorded page request brings the address and payload the frontend sends.
 */
final class RouteCall
{
    /**
     * @var array<string, mixed>
     */
    public private(set) array $parameters = [];

    /**
     * @var array<string, mixed>
     */
    public private(set) array $query = [];

    /**
     * @var array<string, mixed>
     */
    public private(set) array $payload = [];

    /**
     * @var array<string, string>
     */
    public private(set) array $headers = [];

    /**
     * @var list<ExpectedCommand>
     */
    public private(set) array $expected = [];

    /**
     * @var array<class-string<Command<mixed>>, mixed>
     */
    public private(set) array $replies = [];

    /**
     * The user, by the name the test journal knows, to whom the route's page is hidden.
     */
    public private(set) string|null $hiddenFrom = null;

    /**
     * The address a recorded page request was sent to, in place of the one built from the route's name.
     */
    public private(set) string|null $recordedAddress = null;

    /**
     * @param  TestStart|EnrolledHost|string|null  $signer  the start that signs an agent call, the host of a host call
     *                                                      or of a public call its controller verifies, or the bearer
     *                                                      token of a device grant's call
     */
    private function __construct(
        public readonly Caller $caller,
        public readonly TestStart|EnrolledHost|string|null $signer,
    ) {}

    public static function as(Caller $caller, TestStart|EnrolledHost|string|null $signer = null): self
    {
        return new self($caller, $signer);
    }

    /**
     * A page request the frontend sent, as tests/Contracts/page-requests/<name>.json holds it, with each recorded id
     * replaced by the real one; it is sent as the user in place.
     *
     * @param  array<string, string>  $ids  each recorded id and the real id that takes its place
     */
    public static function recorded(string $name, array $ids): self
    {
        /**
         * @var array{method: string, url: string, body?: array<string, mixed>|null, headers?: array<string, string>} $request
         */
        $request = HostContract::of("page-requests/{$name}.json")->readFor(array_flip($ids));
        $call = new self(Caller::User, null);
        $call->recordedAddress = $request['url'];
        $call->payload = $request['body'] ?? [];
        $call->headers = $request['headers'] ?? [];

        return $call;
    }

    /**
     * @param  array<string, mixed>  $parameters
     */
    public function parameters(array $parameters): self
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * @param  array<string, mixed>  $query
     */
    public function query(array $query): self
    {
        $this->query = $query;

        return $this;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function payload(array $payload): self
    {
        $this->payload = $payload;

        return $this;
    }

    /**
     * @param  array<string, string>  $headers
     */
    public function headers(array $headers): self
    {
        $this->headers = $headers;

        return $this;
    }

    /**
     * One more command the call must send, after those expected before it, with the arguments it must carry.
     *
     * @param  class-string<Command<mixed>>  $command
     * @param  array<string, mixed>  $arguments
     */
    public function expects(string $command, array $arguments = []): self
    {
        $this->expected[] = ExpectedCommand::of($command, $arguments);

        return $this;
    }

    /**
     * The reply the sink gives each command of the class, a value of the command's own result type, as the action
     * reads it.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function reply(string $command, mixed $reply): self
    {
        $this->replies[$command] = $reply;

        return $this;
    }

    public function hiddenFrom(string $user): self
    {
        $this->hiddenFrom = $user;

        return $this;
    }
}
