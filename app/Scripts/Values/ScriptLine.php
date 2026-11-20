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
        $statement = rtrim($body);
        [$token, $operand] = array_pad(preg_split('/\h+/u', $statement, 2) ?: [$statement], 2, '');
        $offset = $operand === '' ? strlen($token) : strlen($statement) - strlen($operand);

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
