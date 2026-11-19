<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\RefusalCode;

/**
 * Why a line was refused, at which node and source text, how to correct it, and the command request that holds the
 * work when one does; nothing of the line started. Secrets in assignments and addresses are never shown.
 */
final readonly class AdmissionRefusal
{
    public const string NOTICE = 'Nothing in this request started.';

    private const int EXCERPT_LENGTH = 200;

    private function __construct(
        public RefusalCode $code,
        public int $node,
        public string $excerpt,
        public string $reason,
        public string $correction,
        public string $requestId,
        public string $next,
    ) {}

    public static function of(RefusalCode $code, int $node, string $source, string $reason, string $correction): self
    {
        return new self($code, $node, self::redacted($source), $reason, $correction, '', '');
    }

    /**
     * This refusal with the command request that now holds the work and its next allowed step.
     */
    /**
     * The refusal as an agent reads it: what was refused and why, how to correct it, and the request that holds the
     * work with its next step.
     */
    public function message(): string
    {
        $message = "{$this->code->value}: {$this->reason} ".self::NOTICE." Correction: {$this->correction}";
        if ($this->requestId === '') {
            return $message;
        }

        return "{$message} Request {$this->requestId}. Next: {$this->next}";
    }

    public function heldIn(string $requestId, string $next): self
    {
        return new self($this->code, $this->node, $this->excerpt, $this->reason, $this->correction, $requestId, $next);
    }

    private static function redacted(string $source): string
    {
        $text = (string) preg_replace('/\b([A-Za-z_][A-Za-z0-9_]*=)[^\s;&|]+/', '$1***', $source);
        $text = (string) preg_replace('#://[^/\s:@]+:[^/\s@]+@#', '://***@', $text);
        $escaped = addcslashes($text, "\0..\37\177");

        return strlen($escaped) > self::EXCERPT_LENGTH ? substr($escaped, 0, self::EXCERPT_LENGTH).'...' : $escaped;
    }
}
