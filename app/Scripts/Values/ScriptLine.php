<?php

declare(strict_types=1);

namespace App\Scripts\Values;

final readonly class ScriptLine
{
    private function __construct(
        public string $token,
        public string $operand,
        public ScriptRange $source,
        public ScriptRange $operandSource,
    ) {}

    public static function read(string $line, int $number): self
    {
        $body = ltrim($line);
        $column = mb_strlen($line) - mb_strlen($body) + 1;
        $parts = preg_split('/\h+/u', rtrim($body), 2, PREG_SPLIT_OFFSET_CAPTURE);
        $token = $parts[0][0];
        $operand = $parts[1][0] ?? '';
        $offset = $parts[1][1] ?? strlen($token);

        return new self(
            $token,
            $operand,
            new ScriptRange($number, $column, mb_strlen($token)),
            new ScriptRange($number, $column + mb_strlen(substr($body, 0, $offset)), mb_strlen($operand)),
        );
    }

    public function isBlank(): bool
    {
        return $this->token === '' || str_starts_with($this->token, '#');
    }
}
