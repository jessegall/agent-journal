<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Exceptions\HostProtocolRefused;
use App\Hosts\ContainedPlanRules;
use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\HostCallReader;
use App\Hosts\Protocol\HostAnswerStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostAnswerPayload;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;
use App\Hosts\RelayHostReader;
use App\Hosts\Values\RelayCall;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\Wire;
use App\Recordings\Exceptions\RecordingBreaksProtocol;

/**
 * Judges recorded host and relay calls by their generated readers and reports the first invalid exchange event.
 */
final readonly class RecordedProtocol
{
    public function __construct(
        private HostCallReader $reader,
        private ContainedPlanRules $containedRules,
        private RelayHostReader $relayReader,
    ) {}

    /**
     * @throws RecordingBreaksProtocol
     */
    public function assertKept(ScenarioRecording $recording): void
    {
        foreach ($recording->exchangesOn(Wire::Host) as $name) {
            foreach ($recording->exchange($name)->events as $index => $event) {
                $this->assertCallKept($recording->manifest()->protocol, $name, $index, $event);
            }
        }
    }

    /**
     * The calls, instruction types and refusals of the protocol none of the recordings holds.
     *
     * @param  list<ScenarioRecording>  $recordings
     */
    public function coverage(array $recordings): ProtocolCoverage
    {
        $routes = [];
        $relayRoutes = [];
        $instructionTypes = [];
        $refusals = [];

        foreach ($recordings as $recording) {
            foreach ($recording->calls(Wire::Host) as $call) {
                $route = $this->routeOf($call);
                if ($recording->manifest()->protocol === HostProtocol::RELAY) {
                    $relayRoute = $this->relayReader->callFor($call->method, $call->path);
                    $relayRoutes[] = $relayRoute?->name;
                } else {
                    $routes[] = $route;
                }

                if ($route === HostRoute::ClaimInstruction && $call->status !== null && $call->body !== '') {
                    $instructionTypes = [
                        ...$instructionTypes,
                        ...array_map(
                            fn (HostInstructionPayload $instruction) => HostInstructionType::tryFrom($instruction->type),
                            HostClaimedInstructionsPayload::from($call->body)->instructions,
                        ),
                    ];
                }

                if ($route === HostRoute::AnswerInstruction && $call->status === null && $call->body !== '') {
                    $refusals[] = HostAnswerPayload::from($call->body)->refusal;
                }
            }
        }

        return new ProtocolCoverage(
            array_values(array_filter(HostRoute::cases(), fn (HostRoute $route) => ! in_array($route, $routes, true))),
            array_values(array_filter(
                HostInstructionType::cases(),
                fn (HostInstructionType $type) => ! in_array($type, $instructionTypes, true),
            )),
            array_values(array_filter(
                HostRefusal::cases(),
                fn (HostRefusal $refusal) => ! in_array($refusal, $refusals, true),
            )),
            array_values(array_map(
                fn (RelayCall $route) => $route->name,
                array_filter(HostProtocol::relayCalls(), fn (RelayCall $route) => ! in_array($route->name, $relayRoutes, true)),
            )),
        );
    }

    /**
     * @throws RecordingBreaksProtocol
     */
    private function assertCallKept(int $protocol, string $exchange, int $index, RecordedEvent $event): void
    {
        $call = $event->call;

        if ($call === null || $call->isWithheld) {
            return;
        }

        $relayRoute = $this->relayReader->callFor($call->method, $call->path);
        $route = $protocol === HostProtocol::RELAY ? $relayRoute : ($this->routeOf($call) ?? $relayRoute);

        if ($route === null) {
            $error = "{$call->method} {$call->path} is no call of the enrolled host or relay protocol";

            throw RecordingBreaksProtocol::at($protocol, $exchange, $index, $error);
        }

        try {
            if ($route instanceof RelayCall) {
                $this->assertRelayCallKept($route, $call);

                return;
            }

            match ($event->type) {
                RecordedEventType::Asked => $this->assertAskedKept($route, $call),
                default => $this->assertAnsweredKept($route, $call),
            };
        } catch (HostCallUnreadable|HostProtocolRefused $broken) {
            throw RecordingBreaksProtocol::at($protocol, $exchange, $index, $broken->getMessage(), $broken);
        }
    }

    private function assertRelayCallKept(RelayCall $route, RecordedCall $call): void
    {
        if ($call->status === null) {
            $payload = $this->relayReader->readRequest($route, $call->query, $call->body);

            if ($payload instanceof HostAnswerPayload) {
                $this->assertAnswerKept($payload);
            }

            return;
        }

        if ($call->status >= 400) {
            return;
        }

        if ($call->status !== $route->status) {
            throw HostCallUnreadable::invalid($route->name, ['status' => ["Expected HTTP {$route->status}"]]);
        }

        $body = $call->status === 204 && $call->body === '' ? '{}' : $call->body;
        $reply = $this->reader->read($body, $route->reply, "reply to {$route->name}");

        if ($reply instanceof HostClaimedInstructionsPayload) {
            $this->assertInstructionsKept($reply);
        }
    }

    /**
     * @throws HostCallUnreadable
     */
    private function assertAskedKept(HostRoute $route, RecordedCall $call): void
    {
        $body = $this->reader->read($call->body === '' ? '{}' : $call->body, $route->bodyPayload(), $route->value);

        if ($body instanceof HostAnswerPayload) {
            $this->assertAnswerKept($body);
        }
    }

    private function assertAnswerKept(HostAnswerPayload $body): void
    {
        if ($body->status !== HostAnswerStatus::Refused) {
            return;
        }

        foreach (HostRefusal::ANSWER_FIELDS as $field) {
            if ($body->{$field} === null) {
                throw HostCallUnreadable::missingField('refused answer', $field);
            }
        }
    }

    /**
     * @throws HostCallUnreadable
     * @throws HostProtocolRefused
     */
    private function assertAnsweredKept(HostRoute $route, RecordedCall $call): void
    {
        if ($call->body === '' || $call->status !== 200) {
            return;
        }

        $reply = $this->reader->read($call->body, $route->replyPayload(), "reply to {$route->value}");

        if ($reply instanceof HostClaimedInstructionsPayload) {
            $this->assertInstructionsKept($reply);
        }
    }

    private function assertInstructionsKept(HostClaimedInstructionsPayload $reply): void
    {
        foreach ($reply->instructions as $instruction) {
            $type = HostInstructionType::from($instruction->type);
            $payload = $this->reader->read($instruction->payload, $type->payloadOf(), "payload of {$type->value}");

            if ($payload instanceof HostOpenPlanPayload) {
                $this->containedRules->assertKept($payload);
            }
        }
    }

    private function routeOf(RecordedCall $call): HostRoute|null
    {
        return array_find(HostRoute::cases(), fn (HostRoute $route) => $route->matchesPath($call->path));
    }
}
