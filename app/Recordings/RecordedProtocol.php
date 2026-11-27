<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Exceptions\HostProtocolRefused;
use App\Hosts\ContainedPlanRules;
use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\HostCallReader;
use App\Hosts\Protocol\Data\HostAnswerData;
use App\Hosts\Protocol\Data\HostClaimedOrdersData;
use App\Hosts\Protocol\Data\HostOpenPlanData;
use App\Hosts\Protocol\Data\HostOrderData;
use App\Hosts\Protocol\HostAnswerStatus;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\Wire;
use App\Recordings\Exceptions\RecordingBreaksProtocol;

/**
 * Judges a recording by host protocol 1 as the generator wrote it, holding no rule of its own: every recorded host
 * call, claimed order, payload, plan and answer goes through the generated strict readers and the contained plan rules,
 * and the first that breaks them refuses the recording by its exchange, its event and the reader's error.
 */
final readonly class RecordedProtocol
{
    public function __construct(private HostCallReader $reader, private ContainedPlanRules $containedRules) {}

    /**
     * @throws RecordingBreaksProtocol
     */
    public function assertKept(ScenarioRecording $recording): void
    {
        foreach ($recording->exchangesOn(Wire::Host) as $name) {
            foreach ($recording->exchange($name)->events as $index => $event) {
                $this->assertCallKept($name, $index, $event);
            }
        }
    }

    /**
     * The calls, order types and refusals of the protocol none of the recordings holds.
     *
     * @param  list<ScenarioRecording>  $recordings
     */
    public function coverage(array $recordings): ProtocolCoverage
    {
        $routes = [];
        $orderTypes = [];
        $refusals = [];

        foreach ($recordings as $recording) {
            foreach ($recording->calls(Wire::Host) as $call) {
                $route = $this->routeOf($call);
                $routes[] = $route;

                if ($route === HostRoute::ClaimOrders && $call->status !== null && $call->body !== '') {
                    $orderTypes = [
                        ...$orderTypes,
                        ...array_map(
                            fn (HostOrderData $order) => HostOrderType::tryFrom($order->type),
                            HostClaimedOrdersData::from($call->body)->orders,
                        ),
                    ];
                }

                if ($route === HostRoute::AnswerOrder && $call->status === null && $call->body !== '') {
                    $refusals[] = HostAnswerData::from($call->body)->refusal;
                }
            }
        }

        return new ProtocolCoverage(
            array_values(array_filter(HostRoute::cases(), fn (HostRoute $route) => ! in_array($route, $routes, true))),
            array_values(array_filter(
                HostOrderType::cases(),
                fn (HostOrderType $type) => ! in_array($type, $orderTypes, true),
            )),
            array_values(array_filter(
                HostRefusal::cases(),
                fn (HostRefusal $refusal) => ! in_array($refusal, $refusals, true),
            )),
        );
    }

    /**
     * @throws RecordingBreaksProtocol
     */
    private function assertCallKept(string $exchange, int $index, RecordedEvent $event): void
    {
        $call = $event->call;

        if ($call === null || $call->isWithheld) {
            return;
        }

        $route = $this->routeOf($call);

        if ($route === null) {
            $error = "{$call->method} {$call->path} is no call of host protocol 1, such as a relay call of protocol 2";

            throw RecordingBreaksProtocol::at($exchange, $index, $error);
        }

        try {
            match ($event->type) {
                RecordedEventType::Asked => $this->assertAskedKept($route, $call),
                default => $this->assertAnsweredKept($route, $call),
            };
        } catch (HostCallUnreadable|HostProtocolRefused $broken) {
            throw RecordingBreaksProtocol::at($exchange, $index, $broken->getMessage(), $broken);
        }
    }

    /**
     * @throws HostCallUnreadable
     */
    private function assertAskedKept(HostRoute $route, RecordedCall $call): void
    {
        $body = $this->reader->read($call->body === '' ? '{}' : $call->body, $route->bodyData(), $route->value);

        if (! $body instanceof HostAnswerData || $body->status !== HostAnswerStatus::Refused) {
            return;
        }

        foreach (HostProtocol::REFUSED_ANSWER_NAMES as $field) {
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

        $reply = $this->reader->read($call->body, $route->replyData(), "reply to {$route->value}");

        if (! $reply instanceof HostClaimedOrdersData) {
            return;
        }

        foreach ($reply->orders as $order) {
            $type = HostOrderType::from($order->type);
            $payload = $this->reader->read($order->payload, $type->payloadData(), "payload of {$type->value}");

            if ($payload instanceof HostOpenPlanData) {
                $this->containedRules->assertKept($payload);
            }
        }
    }

    private function routeOf(RecordedCall $call): HostRoute|null
    {
        return array_find(HostRoute::cases(), fn (HostRoute $route) => $route->matchesPath($call->path));
    }
}
