<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\ContainedPlanRules;
use App\Hosts\HostCallReader;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;
use App\Models\Hosts\HostInstruction;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\Recordings;
use App\Recordings\ScenarioRecording;
use PHPUnit\Framework\Assert;
use Tests\Support\Recordings\Exceptions\LiveValueRefused;
use Tests\Support\Recordings\RecordingValues;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's side of a recorded scenario, played to the journal in a command test: it sends a call the recorded host
 * made, and answers or refuses an order the journal gave with the recorded host's answer to the same order, binding
 * the recording's fakes to the test's own ids as it goes. It reads every order it takes as a host reads it, strictly.
 */
final class MockHost
{
    private ScenarioRecording|null $recording = null;

    private string $scenario = '';

    private readonly RecordingValues $values;

    public function __construct(private readonly TestJournal $journal, private readonly string $host)
    {
        $this->values = new RecordingValues();
    }

    /**
     * The host plays the recorded scenario, named as <driver>/<scenario>.
     */
    public function playing(string $scenario): self
    {
        [$driver, $name] = explode('/', $scenario, 2);
        $this->recording = $this->journal->service(Recordings::class)->scenario($driver, $name);
        $this->scenario = $scenario;

        return $this;
    }

    /**
     * The host makes the nth call of the route the recorded host made, signed for the test's host, with the test's ids
     * in place of the fakes they were bound to.
     */
    public function sends(HostRoute $route, int $nth = 1): self
    {
        $call = $this->askedOn($route)[$nth - 1]
            ?? Assert::fail("The {$this->scenario} recording holds no call {$nth} of {$route->value}.");

        $this->journal->hostCall(
            $this->journal->hostCalled($this->host),
            $call->method,
            $this->values->live($call->path),
            $this->values->live($call->body),
        )->assertSuccessful();

        return $this;
    }

    /**
     * The host carries out the journal's nth order of the type as the recorded host carried out its own nth order of
     * the type, answering with what the recorded host answered.
     */
    public function answers(HostInstructionType $type, int $nth = 1): self
    {
        [$order, $recorded] = $this->taken($type, $nth);
        $answer = $this->answerTo($recorded->id)
            ?? Assert::fail("The {$this->scenario} recording holds no answer to its {$type->value} order {$nth}.");

        return $this->answer($order, $answer);
    }

    /**
     * The host refuses the journal's nth order of the type with the refusal, as the recorded host refused an order of
     * the type; a recording that holds no such refusal fails the test, as a mock never refuses on its own.
     */
    public function refuses(HostInstructionType $type, HostRefusal $refusal, int $nth = 1): self
    {
        [$order] = $this->taken($type, $nth);

        foreach ($this->recordedOrders($type) as $recorded) {
            $answer = $this->answerTo($recorded->id);
            $fields = $answer === null ? [] : (array) json_decode($answer->body, true);

            if (($fields['status'] ?? '') === 'refused' && ($fields['refusal'] ?? '') === $refusal->value) {
                $this->hearOrder($order, $recorded);

                return $this->answer($order, $answer);
            }
        }

        Assert::fail("The {$this->scenario} recording holds no {$type->value} order refused as {$refusal->value}.");
    }

    /**
     * The journal's nth order of the type, read strictly as a host reads it, with the recording's nth order of the
     * type, its fakes bound to the live order's values.
     *
     * @return array{HostInstruction, HostInstructionPayload}
     */
    private function taken(HostInstructionType $type, int $nth): array
    {
        $order = HostInstruction::query()
            ->where('host_id', $this->journal->hostCalled($this->host)->hostId)
            ->where('type', $type)
            ->orderBy('id')
            ->get()
            ->values()
            ->get($nth - 1)
            ?? Assert::fail("The journal gave the host no {$type->value} order {$nth}.");
        $recorded = $this->recordedOrders($type)[$nth - 1]
            ?? Assert::fail("The {$this->scenario} recording holds no {$type->value} order {$nth}.");

        $this->readStrictly($order);
        $this->hearOrder($order, $recorded);

        return [$order, $recorded];
    }

    /**
     * Reads the order as the host's generated readers do: a field its payload does not have, one it lacks or one its
     * rules refuse fails the test, as does a contained plan that names anything of the host.
     */
    private function readStrictly(HostInstruction $order): void
    {
        $payload = $this->journal->service(HostCallReader::class)
            ->read($order->payload, $order->type->payloadOf(), "the {$order->type->value} order");

        if ($payload instanceof HostOpenPlanPayload) {
            $this->journal->service(ContainedPlanRules::class)->assertKept($payload);
        }
    }

    /**
     * Binds the recorded order's id and process to the live order's, so what the recorded host sent about them reaches
     * the test's own rows; the rest of a command test's order is its own, never the recorded one.
     */
    private function hearOrder(HostInstruction $order, HostInstructionPayload $recorded): void
    {
        try {
            $this->values->hear(
                "{$this->scenario}.{$order->type->value}",
                ['id' => $recorded->id, 'process' => $recorded->processId],
                ['id' => $order->id, 'process' => (string) $order->host_process_id],
            );
        } catch (LiveValueRefused $refused) {
            Assert::fail($refused->getMessage());
        }
    }

    private function answer(HostInstruction $order, RecordedCall $answer): self
    {
        $this->journal->hostCall(
            $this->journal->hostCalled($this->host),
            'POST',
            "/host/instructions/{$order->id}",
            $this->values->live($answer->body),
        )->assertSuccessful();

        return $this;
    }

    /**
     * The recorded host's answer to its order, none when it never answered it.
     */
    private function answerTo(string $recordedId): RecordedCall|null
    {
        $answers = array_filter(
            $this->askedOn(HostRoute::AnswerInstruction),
            fn (RecordedCall $call) => $call->path === "/host/instructions/{$recordedId}",
        );

        return array_values($answers)[0] ?? null;
    }

    /**
     * The recorded orders of the type, in the order the recorded host claimed them.
     *
     * @return list<HostInstructionPayload>
     */
    private function recordedOrders(HostInstructionType $type): array
    {
        $orders = [];

        foreach ($this->calls() as $call) {
            if ($call->status === null || ! HostRoute::ClaimInstruction->matchesPath($call->path)) {
                continue;
            }

            foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                $orders[] = $instruction;
            }
        }

        return array_values(array_filter($orders, fn (HostInstructionPayload $order) => $order->type === $type->value));
    }

    /**
     * The calls the recorded host made on the route, in order.
     *
     * @return list<RecordedCall>
     */
    private function askedOn(HostRoute $route): array
    {
        return array_values(array_filter(
            $this->calls(),
            fn (RecordedCall $call) => $call->status === null && $route->matchesPath($call->path),
        ));
    }

    /**
     * @return list<RecordedCall>
     */
    private function calls(): array
    {
        $recording = $this->recording ?? Assert::fail('Name the scenario the mock host plays with playing() first.');

        return $recording->calls(Wire::Host);
    }
}
