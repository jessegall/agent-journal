<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use Spatie\LaravelData\Data;

final readonly class RelayCall
{
    /**
     * @param  class-string<Data>  $body
     * @param  class-string<Data>  $reply
     * @param  list<string>  $query
     */
    public function __construct(
        public string $name,
        public string $method,
        private string $pattern,
        public string $body,
        public string $reply,
        public array $query,
        public int|null $bodyLimit,
        public int $status,
    ) {}

    public function matches(string $method, string $path): bool
    {
        return $this->method === $method && preg_match($this->pattern, $path) === 1;
    }
}
