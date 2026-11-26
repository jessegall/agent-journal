<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Actors\Contracts\AgentTexts;
use App\Values\AdmissionRefusal;
use App\Values\AgentText;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Why the shell admission refused a line, where, what to do instead and, for a line held for review, its request.
 */
final class AdmissionRefusalDetails extends Data
{
    public function __construct(
        #[MapName('reason_code')]
        public string $reasonCode,
        public int $node,
        public string $excerpt,
        public string $reason,
        public string $correction,
        #[MapName('request_id')]
        public string $requestId,
        public string $next,
        public string $notice,
    ) {}

    public static function of(AdmissionRefusal $refusal, AgentTexts $texts): self
    {
        return self::from([
            'reasonCode' => $refusal->code->value,
            'node' => $refusal->node,
            'excerpt' => $refusal->excerpt,
            'reason' => $texts->render($refusal->reason),
            'correction' => $texts->render($refusal->correction),
            'requestId' => $refusal->requestId,
            'next' => $refusal->next,
            'notice' => $texts->render(AgentText::of('core.shell.nothing_started')),
        ]);
    }
}
