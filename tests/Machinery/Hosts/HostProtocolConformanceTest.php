<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\HostCallReader;
use App\Hosts\HostPayloadJson;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostAnswerPayload;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * The committed vectors of host protocol 1, which the Go host checks too (programs/runner/hostapi/
 * conformance_test.go): the journal signs each instruction to the committed signature over the committed payload text, and
 * reads each committed answer, report and inventory.
 */
#[TestsMachinery(HostPayloadJson::class)]
#[TestsMachinery(HostCallReader::class)]
final class HostProtocolConformanceTest extends TestCase
{
    private const string VECTORS = __DIR__.'/../../../programs/runner/hostapi/testdata/conformance.json';

    public function test_the_journal_signs_each_committed_instruction_to_its_signature(): void
    {
        $vectors = $this->vectors();
        $host = new Host();
        $host->instruction_secret = $vectors['secret'];

        foreach ($vectors['instructions'] as $vector) {
            $instruction = new HostInstruction();
            $instruction->id = $vector['instruction']['id'];
            $instruction->sequence = $vector['instruction']['sequence'];
            $instruction->type = HostInstructionType::from($vector['instruction']['type']);
            $instruction->host_process_id = $vector['instruction']['process_id'];
            $instruction->payload = HostPayloadJson::encode($vector['payload']);
            $instruction->expires_at = CarbonImmutable::parse($vector['instruction']['expires_at']);

            $this->assertSame($vector['instruction']['payload'], $instruction->payload);
            $this->assertSame($vector['instruction']['signature'], $host->signInstruction($instruction));
        }
    }

    public function test_the_journal_reads_each_committed_answer_report_and_inventory(): void
    {
        $vectors = $this->vectors();

        $reader = $this->app->make(HostCallReader::class);
        $answers = array_map(
            fn (array $answer) => $reader->read($this->encoded($answer), HostAnswerPayload::class, 'answer'),
            $vectors['answers'],
        );
        $report = $reader->read($this->encoded($vectors['reports'][0]), HostProcessReportPayload::class, 'report');
        $inventory = $reader->read($this->encoded($vectors['inventory']), HostInventoryPayload::class, 'inventory');

        $this->assertSame([HostRefusal::GuardMoved, HostRefusal::UnknownInstruction], array_map(
            fn (HostAnswerPayload $answer) => $answer->refusal,
            $answers,
        ));
        $this->assertSame([3, 'pid:42'], [$report->exitCode, $report->identity]);
        $this->assertSame(
            [[
                'open_process',
                'write_keys',
            ], '01jprocess000000000000000001', true],
            [$inventory->capabilities, $inventory->processes[0]->processId, $inventory->processes[0]->isTerminalHeld],
        );
    }

    public function test_a_host_call_with_a_field_the_protocol_does_not_know_is_refused_by_its_name(): void
    {
        $inventory = $this->vectors()['inventory'];
        $inventory['processes'][0]['colour'] = 'red';

        $this->expectExceptionObject(HostCallUnreadable::unknownField('inventory', 'processes.0.colour'));

        $this->app->make(HostCallReader::class)->read($this->encoded($inventory), HostInventoryPayload::class, 'inventory');
    }

    public function test_a_host_call_missing_a_field_it_needs_is_refused_by_its_name(): void
    {
        $answer = $this->vectors()['answers'][0];
        unset($answer['status']);

        $this->expectExceptionObject(HostCallUnreadable::missingField('answer', 'status'));

        $this->app->make(HostCallReader::class)->read($this->encoded($answer), HostAnswerPayload::class, 'answer');
    }

    /**
     * @param  array<array-key, mixed>  $fields
     */
    private function encoded(array $fields): string
    {
        return json_encode($fields, JSON_THROW_ON_ERROR);
    }

    /**
     * @return array<string, mixed>
     */
    private function vectors(): array
    {
        return json_decode((string) file_get_contents(self::VECTORS), true, flags: JSON_THROW_ON_ERROR);
    }
}
