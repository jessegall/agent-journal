<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Data\Hosts\HostAnswerData;
use App\Data\Hosts\HostInventoryData;
use App\Data\Hosts\HostProcessReportData;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostRefusal;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use App\Support\Hosts\HostOrderPayload;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

/**
 * The committed vectors of host protocol 1, which the Go host checks too (tools/journal-agent/hostapi/
 * conformance_test.go): the journal signs each order to the committed signature over the committed payload text, and
 * reads each committed answer, report and inventory.
 */
final class HostProtocolConformanceTest extends TestCase
{
    private const string VECTORS = __DIR__.'/../../../tools/journal-agent/hostapi/testdata/conformance.json';

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
            $order->payload = $vector['payload'];
            $order->expires_at = CarbonImmutable::parse($vector['order']['expires_at']);

            $this->assertSame($vector['order']['payload'], HostOrderPayload::encode($order->payload));
            $this->assertSame($vector['order']['signature'], $host->signOrder($order));
        }
    }

    public function test_the_journal_reads_each_committed_answer_report_and_inventory(): void
    {
        $vectors = $this->vectors();

        $answers = array_map(fn (array $answer) => HostAnswerData::from($answer), $vectors['answers']);
        $report = HostProcessReportData::from($vectors['reports'][0]);
        $inventory = HostInventoryData::from($vectors['inventory']);

        $this->assertSame([HostRefusal::GuardMoved, HostRefusal::UnknownOrder], array_map(
            fn (HostAnswerData $answer) => $answer->refusalReason(),
            $answers,
        ));
        $this->assertSame([3, 'pid:42'], [$report->exitCode, $report->identity]);
        $this->assertSame(
            [['open_process', 'write_keys'], '01jprocess000000000000000001', true],
            [$inventory->capabilities, $inventory->processes[0]->processId, $inventory->processes[0]->isTerminalHeld],
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function vectors(): array
    {
        return json_decode((string) file_get_contents(self::VECTORS), true, flags: JSON_THROW_ON_ERROR);
    }
}
