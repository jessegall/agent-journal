<?php

declare(strict_types=1);

namespace App\Http\Loaders\Profiles;

use App\Contracts\Sessions\SessionRequestResolver;
use App\Data\Profiles\StartReceiptData;
use App\Data\Profiles\StartReceiptInput;
use App\Enums\Sessions\StartDisposition;
use App\Exceptions\SessionRequestMissing;
use App\Models\Agents\AgentRuntime;
use App\Support\SessionRequestDetails;
use App\Support\StartRefusalCodes;
use App\Support\StartRemedyWords;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Where a submitted start stands, read by the request id the browser kept when its reply was lost. Only the requester
 * or an agent maintainer reads it; anyone else is told the item is unavailable, and nothing of the start.
 */
final readonly class StartReceiptLoader
{
    private const string UNAVAILABLE = 'This item is unavailable.';

    public function __construct(private SessionRequestResolver $records, private StartRemedyWords $words) {}

    public function __invoke(StartReceiptInput $input): StartReceiptData
    {
        try {
            $receipt = $this->records->receipt(strtolower($input->request));
        } catch (SessionRequestMissing $missing) {
            throw new NotFoundHttpException(self::UNAVAILABLE, $missing);
        }

        return match ($receipt->disposition) {
            StartDisposition::Accepted => self::answer($receipt->requestId, 'pending'),
            StartDisposition::Started => self::answer($receipt->requestId, 'accepted', [
                'sessionId' => $receipt->sessionId,
                'generation' => $receipt->sessionId === null
                    ? null
                    : AgentRuntime::findForSession($receipt->sessionId)?->process_generation,
            ]),
            StartDisposition::Refused, StartDisposition::Failed => $this->refused($receipt),
        };
    }

    private function refused(SessionRequestDetails $receipt): StartReceiptData
    {
        $code = (string) $receipt->refusalReason;
        $reason = StartRefusalCodes::reasonOf($code);

        return self::answer($receipt->requestId, 'refused', [
            'reasonCode' => $code,
            'explanation' => $reason->explanation(),
            'remedy' => $this->words->textOf($reason->remedy()),
        ]);
    }

    /**
     * @param  array<string, string|int|null>  $fields  the fields the state has; every other one is left out
     */
    private static function answer(string $requestId, string $state, array $fields = []): StartReceiptData
    {
        return StartReceiptData::from([
            'requestId' => $requestId,
            'state' => $state,
            'sessionId' => new Optional(),
            'generation' => new Optional(),
            'reasonCode' => new Optional(),
            'explanation' => new Optional(),
            'remedy' => new Optional(),
            ...$fields,
        ]);
    }
}
