<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Values\RelayCall;
use Illuminate\Http\Request;

final readonly class RelayHostReader
{
    public function __construct(private HostCallReader $reader) {}

    public function assertRequest(Request $request): void
    {
        $path = '/'.$request->path();
        $call = array_find(
            HostProtocol::relayCalls(),
            fn (RelayCall $call) => $call->matches($request->method(), $path),
        );

        if ($call === null) {
            return;
        }

        foreach (array_diff(array_keys($request->query->all()), $call->query) as $field) {
            throw HostCallUnreadable::unknownField($call->name, (string) $field);
        }

        $body = $request->getContent();
        $json = $body === '' ? '{}' : $body;

        if ($call->bodyLimit === null) {
            $this->reader->read($json, $call->body, $call->name);

            return;
        }

        $this->reader->readAtMost($json, $call->bodyLimit, $call->body, $call->name);
    }
}
