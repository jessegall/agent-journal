<?php

declare(strict_types=1);

namespace Tests\Reads\Profiles;

use App\Contracts\Sessions\SessionRequestResolver;
use App\Data\Profiles\StartReceiptData;
use App\Data\Profiles\StartReceiptInput;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverSourceType;
use App\Enums\Sessions\ModelSelectionType;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\SessionRequestMissing;
use App\Http\Loaders\Profiles\StartReceiptLoader;
use App\Support\SessionRequestDetails;
use Illuminate\Validation\ValidationException;
use Mockery;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * Where a start stands, by the request id the browser kept: pending, or refused with its reason, explanation and next
 * step; a request the reader may not see is unavailable, and the id keeps its bound.
 */
#[TestsRead(StartReceiptLoader::class)]
final class StartReceiptLoaderTest extends TestCase
{
    public function test_an_accepted_start_is_pending_and_names_nothing_more(): void
    {
        $this->bindReceipt(StartDisposition::Accepted, null);

        $this->assertSame(['requestId' => 'request-1', 'state' => 'pending'], $this->read('REQUEST-1')->toArray());
    }

    public function test_a_refused_start_names_its_reason_explanation_and_next_step(): void
    {
        $this->bindReceipt(StartDisposition::Refused, 'unknown');

        $answer = $this->read('request-1')->toArray();

        $this->assertSame(['requestId', 'state', 'reasonCode', 'explanation', 'remedy'], array_keys($answer));
        $this->assertSame(['refused', 'unknown'], [$answer['state'], $answer['reasonCode']]);
    }

    public function test_a_request_the_reader_may_not_see_is_unavailable(): void
    {
        $records = Mockery::mock(SessionRequestResolver::class);
        $records->allows('receipt')->andThrow(SessionRequestMissing::forRequest('request-1'));
        $this->app->instance(SessionRequestResolver::class, $records);

        $this->expectException(NotFoundHttpException::class);

        $this->read('request-1');
    }

    public function test_a_request_id_past_its_bound_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        StartReceiptInput::validateAndCreate(['request' => str_repeat('r', 65)]);
    }

    private function bindReceipt(StartDisposition $disposition, string|null $refusalReason): void
    {
        $records = Mockery::mock(SessionRequestResolver::class);
        $records->allows('receipt')->with('request-1')->andReturn(new SessionRequestDetails(
            'request-1',
            'agent-1',
            'driver-1',
            'model-1',
            ModelSelectionType::Named,
            'model-1',
            DriverSourceType::Explicit,
            StartOriginType::OwnerRequest,
            null,
            ConversationModeType::New,
            $disposition,
            null,
            $refusalReason,
            null,
        ));
        $this->app->instance(SessionRequestResolver::class, $records);
    }

    private function read(string $request): StartReceiptData
    {
        $input = StartReceiptInput::validateAndCreate(['request' => $request]);

        return $this->app->make(StartReceiptLoader::class)($input);
    }
}
