<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\HostCallReader;
use App\Hosts\HostOrderPayload;
use App\Hosts\Protocol\Data\HostAnswerData;
use App\Hosts\Protocol\Data\HostInventoryData;
use App\Hosts\Protocol\Data\HostProcessReportData;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * The committed vectors of host protocol 1, which the Go host checks too (programs/agent/hostapi/
 * conformance_test.go): the journal signs each order to the committed signature over the committed payload text, and
 * reads each committed answer, report and inventory.
 */
#[TestsMachinery(HostOrderPayload::class)]
#[TestsMachinery(HostCallReader::class)]
final class HostProtocolConformanceTest extends TestCase
{
    private const string VECTORS = __DIR__.'/../../../programs/agent/hostapi/testdata/conformance.json';

    public function test_the_journal_signs_each_committed_order_to_its_signature(): void
    {
        $vectors = $this->vectors();
        $host = new Host();
        $host->order_secret = $vectors['secret'];

        foreach ($vectors['orders'] as $vector) {
            $order = new HostOrder();
            $order->id = $vector['order']['id'];
            $order->sequence = $vector['order']['sequence'];
            $order->type = HostOrderType::from($vector['order']['type']);
            $order->host_process_id = $vector['order']['process_id'];
            $order->payload = HostOrderPayload::encode($vector['payload']);
            $order->expires_at = CarbonImmutable::parse($vector['order']['expires_at']);

            $this->assertSame($vector['order']['payload'], $order->payload);
            $this->assertSame($vector['order']['signature'], $host->signOrder($order));
        }
    }

    public function test_the_journal_reads_each_committed_answer_report_and_inventory(): void
    {
        $vectors = $this->vectors();

        $reader = $this->app->make(HostCallReader::class);
        $answers = array_map(
            fn (array $answer) => $reader->read($this->encoded($answer), HostAnswerData::class, 'answer'),
            $vectors['answers'],
        );
        $report = $reader->read($this->encoded($vectors['reports'][0]), HostProcessReportData::class, 'report');
        $inventory = $reader->read($this->encoded($vectors['inventory']), HostInventoryData::class, 'inventory');

        $this->assertSame([HostRefusal::GuardMoved, HostRefusal::UnknownOrder], array_map(
            fn (HostAnswerData $answer) => $answer->refusal,
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

        $this->app->make(HostCallReader::class)->read($this->encoded($inventory), HostInventoryData::class, 'inventory');
    }

    public function test_a_host_call_missing_a_field_it_needs_is_refused_by_its_name(): void
    {
        $answer = $this->vectors()['answers'][0];
        unset($answer['status']);

        $this->expectExceptionObject(HostCallUnreadable::missingField('answer', 'status'));

        $this->app->make(HostCallReader::class)->read($this->encoded($answer), HostAnswerData::class, 'answer');
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
