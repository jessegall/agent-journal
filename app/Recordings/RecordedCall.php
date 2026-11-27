<?php

declare(strict_types=1);

namespace App\Recordings;

use Illuminate\Http\Request;
use JsonSerializable;
use Symfony\Component\HttpFoundation\Response;

/**
 * One call across a wire as a recording keeps it, asked or answered: its method and path, the query, the answer's
 * status, the few headers a client reads, and the body, cut past its limit. A private value's answer keeps only
 * that a value was sent.
 */
final readonly class RecordedCall implements JsonSerializable
{
    /**
     * The most bytes of a body a recording keeps.
     */
    public const int BODY_BYTE_LIMIT = 65536;

    /**
     * The headers a recording keeps: those a client reads, never a signature, a credential or a cookie.
     */
    private const array KEPT_HEADERS = [
        'Content-Type',
        'Accept',
        'Content-Encoding',
        'Api-Version',
        'Docker-Experimental',
        'Ostype',
        'Server',
    ];

    /**
     * The route whose answer holds a private value, which a recording never keeps.
     */
    private const string PRIVATE_VALUE_ROUTE = 'agents.host.private-values.pull';

    /**
     * @param  array<string, string>  $query
     * @param  array<string, string>  $headers
     */
    private function __construct(
        public string $method,
        public string $path,
        public array $query,
        public int|null $status,
        public array $headers,
        public string $body,
        public bool $isUpgraded,
        public bool $isCut,
        public bool $isWithheld,
    ) {}

    /**
     * The call as the client asked it.
     */
    public static function askedBy(Request $request): self
    {
        $body = $request->getContent();

        return new self(
            $request->method(),
            '/'.ltrim($request->path(), '/'),
            array_map(strval(...), $request->query->all()),
            null,
            self::keptHeaders($request->headers->all()),
            substr($body, 0, self::BODY_BYTE_LIMIT),
            $request->headers->has('Upgrade'),
            strlen($body) > self::BODY_BYTE_LIMIT,
            false,
        );
    }

    /**
     * The answer the server gave the request.
     */
    public static function answeredWith(Response $response, Request $request): self
    {
        $isWithheld = $request->route()?->getName() === self::PRIVATE_VALUE_ROUTE;
        $body = $isWithheld ? '' : (string) $response->getContent();

        return new self(
            $request->method(),
            '/'.ltrim($request->path(), '/'),
            array_map(strval(...), $request->query->all()),
            $response->getStatusCode(),
            self::keptHeaders($response->headers->all()),
            substr($body, 0, self::BODY_BYTE_LIMIT),
            $response->getStatusCode() === Response::HTTP_SWITCHING_PROTOCOLS,
            strlen($body) > self::BODY_BYTE_LIMIT,
            $isWithheld,
        );
    }

    /**
     * The call with every real value of its path, query and body faked.
     */
    public function fakedBy(RecordingFakes $fakes): self
    {
        return clone ($this, [
            'path' => $fakes->replaceIn($this->path),
            'query' => array_map($fakes->replaceIn(...), $this->query),
            'body' => $fakes->replaceIn($this->body),
        ]);
    }

    public function withBody(string $body): self
    {
        return clone ($this, ['body' => $body]);
    }

    /**
     * @param  array<string, mixed>  $line
     */
    public static function fromLine(array $line): self
    {
        return new self(
            (string) $line['method'],
            (string) $line['path'],
            array_map(strval(...), (array) $line['query']),
            $line['status'] === null ? null : (int) $line['status'],
            array_map(strval(...), (array) $line['headers']),
            (string) base64_decode((string) $line['body'], true),
            (bool) $line['upgraded'],
            (bool) $line['cut'],
            (bool) $line['withheld'],
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'method' => $this->method,
            'path' => $this->path,
            'query' => $this->query,
            'status' => $this->status,
            'headers' => $this->headers,
            'body' => base64_encode($this->body),
            'upgraded' => $this->isUpgraded,
            'cut' => $this->isCut,
            'withheld' => $this->isWithheld,
        ];
    }

    /**
     * The kept headers among those sent, each by its name with its first value.
     *
     * @param  array<string, list<string|null>>  $headers
     * @return array<string, string>
     */
    private static function keptHeaders(array $headers): array
    {
        $kept = [];

        foreach (self::KEPT_HEADERS as $name) {
            $values = $headers[strtolower($name)] ?? [];

            if ($values !== [] && $values[0] !== null) {
                $kept[$name] = $values[0];
            }
        }

        return $kept;
    }
}
