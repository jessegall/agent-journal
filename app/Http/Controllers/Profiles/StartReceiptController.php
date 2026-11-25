<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Contracts\Sessions\StartRecordResolver;
use App\Enums\Sessions\StartDisposition;
use App\Exceptions\StartRecordMissing;
use App\Models\Agents\AgentRuntime;
use App\Support\StartRecordDetails;
use App\Support\StartRefusalCodes;
use App\Support\StartRemedyWords;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Where a submitted start stands, read by the request id the browser kept when its reply was lost: pending, accepted
 * with its session and process generation, or refused with its reason code, explanation and one next step. Only the
 * requester or an agent maintainer reads it; anyone else is told the item is unavailable, and nothing of the start.
 */
final readonly class StartReceiptController
{
    private const string UNAVAILABLE = 'This item is unavailable.';

    /**
     * @return array<string, string|int|null>
     */
    public function __invoke(string $request, StartRecordResolver $records, StartRemedyWords $words): array
    {
        try {
            $receipt = $records->receipt(strtolower($request));
        } catch (StartRecordMissing $missing) {
            throw new NotFoundHttpException(self::UNAVAILABLE, $missing);
        }

        return match ($receipt->disposition) {
            StartDisposition::Accepted => [
                'requestId' => $receipt->requestId,
                'state' => 'pending',
            ],
            StartDisposition::Started => self::accepted($receipt),
            StartDisposition::Refused, StartDisposition::Failed => self::refused($receipt, $words),
        };
    }

    /**
     * @return array{requestId: string, state: string, sessionId: string|null, generation: int|null}
     */
    private static function accepted(StartRecordDetails $receipt): array
    {
        return [
            'requestId' => $receipt->requestId,
            'state' => 'accepted',
            'sessionId' => $receipt->sessionId,
            'generation' => $receipt->sessionId === null
                ? null
                : AgentRuntime::ofSession($receipt->sessionId)?->process_generation,
        ];
    }

    /**
     * @return array{requestId: string, state: string, reasonCode: string, explanation: string, remedy: string}
     */
    private static function refused(StartRecordDetails $receipt, StartRemedyWords $words): array
    {
        $code = (string) $receipt->refusalReason;
        $reason = StartRefusalCodes::reasonOf($code);

        return [
            'requestId' => $receipt->requestId,
            'state' => 'refused',
            'reasonCode' => $code,
            'explanation' => $reason->explanation(),
            'remedy' => $words->textOf($reason->remedy()),
        ];
    }
}
