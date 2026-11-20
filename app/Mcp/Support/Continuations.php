<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Agents\Support\AgentContext;
use App\Mcp\Contracts\Continuations as ContinuationsContract;
use App\Mcp\Data\ContinuationPayload;
use App\Mcp\Data\NextAction;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Encryption\Encrypter;

/**
 * Issues and opens the opaque continuation cursors of the calling session: a payload signed with HMAC-SHA256 over the
 * application key, bound to the agent and session and valid for 30 minutes.
 */
final readonly class Continuations implements ContinuationsContract
{
    public const int LIFETIME_MINUTES = 30;

    private const string PURPOSE = 'journal-mcp-continuation';

    public function __construct(private AgentContext $agent, private Encrypter $encrypter) {}

    public function issue(Continuation $continuation): string
    {
        $encodedCursor = self::encode(ContinuationPayload::from([
            'agent' => $this->agent->agentId,
            'session' => $this->agent->sessionId,
            'expires' => CarbonImmutable::now()->addMinutes(self::LIFETIME_MINUTES)->getTimestamp(),
            'tool' => $continuation->tool,
            'selector' => $continuation->selector,
            'filters' => $continuation->filters,
            'offset' => $continuation->offset,
            'character_offset' => $continuation->characterOffset,
            'revision' => $continuation->revision,
            'retained_page' => $continuation->retainedPageId,
        ])->toJson(JSON_THROW_ON_ERROR));

        return $encodedCursor.'.'.$this->signatureOf($encodedCursor);
    }

    public function link(Continuation $position, string $selectorName): NextAction
    {
        return new NextAction($position->tool, [
            $selectorName => $position->selector,
            'continuation' => $this->issue($position),
        ]);
    }

    /**
     * The continuation of a cursor issued to this session for this tool and selector.
     *
     * @throws ContinuationInvalid
     * @throws ContinuationStale
     */
    public function open(string $cursor, string $tool, string $selector): Continuation
    {
        $parts = explode('.', $cursor);

        if (count($parts) !== 2) {
            throw ContinuationInvalid::unreadable();
        }

        if (! hash_equals($this->signatureOf($parts[0]), $parts[1])) {
            throw ContinuationInvalid::changed();
        }

        $fields = $this->fieldsOf($parts[0]);

        if ($fields->agent !== $this->agent->agentId || $fields->session !== $this->agent->sessionId) {
            throw ContinuationInvalid::foreign();
        }

        if ($fields->tool !== $tool || $fields->selector !== $selector) {
            throw ContinuationInvalid::otherRead($tool, $selector);
        }

        if ($fields->expires < CarbonImmutable::now()->getTimestamp()) {
            throw ContinuationStale::expired();
        }

        return $fields->continuation();
    }

    /**
     * The fields of a payload whose signature matched, so the journal wrote them itself.
     */
    private function fieldsOf(string $encodedCursor): ContinuationPayload
    {
        return ContinuationPayload::from(json_decode(self::decode($encodedCursor), true, 16, JSON_THROW_ON_ERROR));
    }

    private function signatureOf(string $encodedCursor): string
    {
        return self::encode(hash_hmac('sha256', self::PURPOSE."\n".$encodedCursor, $this->encrypter->getKey(), true));
    }

    private static function encode(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }

    private static function decode(string $text): string
    {
        return (string) base64_decode(strtr($text, '-_', '+/'), true);
    }
}
