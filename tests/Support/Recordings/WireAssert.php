<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;
use App\Models\Hosts\HostInstruction;
use App\Recordings\Enums\Wire;
use App\Recordings\ScenarioRecording;
use Closure;
use PHPUnit\Framework\Assert;
use Tests\Support\Recordings\Exceptions\LiveValueRefused;

/**
 * What crossed the host wire while a scenario played, asserted against its recording: the orders the journal gave,
 * in order, each order's plan with the live values bound to the recording's fakes, the keys typed, and how a process
 * ended. Every call returns the assertion.
 */
final class WireAssert
{
    /**
     * @param  list<array{HostInstructionType, array<string, mixed>}>  $recorded  each recorded order, with its payload
     * @param  list<HostInstruction>  $live  each order the journal gave while the scenario played
     */
    private function __construct(
        private readonly string $scenario,
        private readonly array $recorded,
        private readonly array $live,
        private readonly RecordingValues $values,
    ) {}

    /**
     * The host wire of the recording against the orders the journal gave.
     *
     * @param  list<HostInstruction>  $live
     */
    public static function ofHost(string $scenario, ScenarioRecording $recording, array $live): self
    {
        $recorded = [];

        foreach ($recording->calls(Wire::Host) as $call) {
            if ($call->status === null || ! HostRoute::ClaimInstruction->matchesPath($call->path)) {
                continue;
            }

            foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                $recorded[] = [HostInstructionType::from($instruction->type), (array) json_decode($instruction->payload, true)];
            }
        }

        return new self($scenario, $recorded, $live, new RecordingValues());
    }

    /**
     * The orders were given in the order and of the types the recording holds, naming the first that differs.
     */
    public function matchesRecording(): self
    {
        $recorded = array_map(fn (array $order) => $order[0]->value, $this->recorded);
        $live = array_map(fn (HostInstruction $order) => $order->type->value, $this->live);

        foreach ($recorded as $index => $type) {
            Assert::assertSame(
                $type,
                $live[$index] ?? 'none',
                "Order {$index} of {$this->scenario} is ".($live[$index] ?? 'missing').", where the recording gave {$type}.",
            );
        }

        Assert::assertCount(count($recorded), $live, "The journal gave orders past the {$this->scenario} recording's.");

        return $this;
    }

    /**
     * The first order of the type, alone, against the recording's first of that type.
     *
     * @param  Closure(self): mixed  $scope
     */
    public function ordered(HostInstructionType $type, Closure $scope): self
    {
        $recorded = array_values(array_filter($this->recorded, fn (array $order) => $order[0] === $type));
        $live = array_values(array_filter($this->live, fn (HostInstruction $order) => $order->type === $type));
        Assert::assertNotEmpty($recorded, "The {$this->scenario} recording holds no {$type->value} order.");
        Assert::assertNotEmpty($live, "The journal gave no {$type->value} order.");
        $scope(new self($this->scenario, [$recorded[0]], [$live[0]], $this->values));

        return $this;
    }

    /**
     * Each order's payload holds the recording's values: every fake stands for one live value of its shape, and
     * every other value is the recorded one, naming the first place that differs.
     */
    public function matchesPayload(): self
    {
        foreach ($this->recorded as $index => [, $payload]) {
            $live = (array) json_decode($this->live[$index]->payload, true);

            try {
                $this->values->hear("{$this->scenario}.{$index}", $payload, $live);
            } catch (LiveValueRefused $refused) {
                Assert::fail($refused->getMessage());
            }
        }

        return $this;
    }

    /**
     * The journal typed the text into a process, in one write of keys.
     */
    public function typed(string $text): self
    {
        $typed = array_map(
            fn (HostInstruction $order) => base64_decode(HostKeyWritePayload::from($order->payload)->bytes, true),
            array_values(array_filter($this->live, fn (HostInstruction $order) => $order->type === HostInstructionType::WriteKeys)),
        );

        Assert::assertTrue(
            array_any($typed, fn (string|false $bytes) => $bytes !== false && str_contains($bytes, $text)),
            "The journal typed no {$text} while {$this->scenario} played.",
        );

        return $this;
    }

    /**
     * The journal gave as many orders as named.
     */
    public function count(int $orders): self
    {
        Assert::assertCount($orders, $this->live, "The journal gave another number of orders while {$this->scenario} played.");

        return $this;
    }
}
