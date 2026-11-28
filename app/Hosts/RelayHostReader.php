<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Values\RelayCall;
use Illuminate\Http\Request;
use Spatie\LaravelData\Data;

final readonly class RelayHostReader
{
    public function __construct(private HostCallReader $reader) {}

    public function assertRequest(Request $request): void
    {
        $path = '/'.$request->path();
        $call = $this->callFor($request->method(), $path);

        if ($call === null) {
            return;
        }

        $this->readRequest($call, $request->query->all(), $request->getContent());
    }

    public function callFor(string $method, string $path): RelayCall|null
    {
        return array_find(HostProtocol::relayCalls(), fn (RelayCall $call) => $call->matches($method, $path));
    }

    /**
     * @param  array<string, mixed>  $query
     */
    public function readRequest(RelayCall $call, array $query, string $body): Data
    {
        foreach (array_diff(array_keys($query), $call->query) as $field) {
            throw HostCallUnreadable::unknownField($call->name, (string) $field);
        }

        $json = $body === '' ? '{}' : $body;

        if ($call->bodyLimit === null) {
            return $this->reader->read($json, $call->body, $call->name);
        }

        return $this->reader->readAtMost($json, $call->bodyLimit, $call->body, $call->name);
    }
}
