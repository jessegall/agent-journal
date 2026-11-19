<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Exceptions\EndpointDeclarationInvalid;
use ReflectionClass;
use ReflectionProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\NameMapper;

/**
 * What one signed call declares: its endpoint, the properties its path fills and the fields its body may carry.
 */
final readonly class CallDeclaration
{
    /**
     * @param  class-string  $call
     * @param  list<string>  $pathProperties
     * @param  list<string>  $bodyFields
     */
    private function __construct(
        public string $call,
        public Endpoint $endpoint,
        public array $pathProperties,
        public array $bodyFields,
    ) {}

    /**
     * @param  class-string  $call
     *
     * @throws EndpointDeclarationInvalid
     */
    public static function of(string $call): self
    {
        $endpoint = EndpointDeclarations::endpointOf($call);
        $inPath = [];
        $body = [];

        foreach (new ReflectionClass($call)->getProperties(ReflectionProperty::IS_PUBLIC) as $property) {
            if ($property->isStatic()) {
                continue;
            }

            if ($property->getAttributes(InPath::class) !== []) {
                $inPath[] = $property->getName();

                continue;
            }

            $mapped = $property->getAttributes(MapName::class);
            $body[] = $mapped === [] ? $property->getName() : self::inputName($mapped[0]->newInstance()->input, $property->getName());
        }

        $declaration = new self($call, $endpoint, $inPath, $body);
        $declaration->requirePathMatchesProperties();

        return $declaration;
    }

    /**
     * The body fields the call does not declare; a field named like a path value is one of them.
     *
     * @param  list<string>  $fields
     * @return list<string>
     */
    public function undeclared(array $fields): array
    {
        return array_values(array_diff($fields, $this->bodyFields));
    }

    /**
     * Whether the call is a keyed write, which carries its request key and names who keeps its receipt.
     */
    public function needsReceipt(): bool
    {
        return $this->endpoint->effect->needsReceipt();
    }

    public function hasRequestKey(): bool
    {
        return in_array('request_key', $this->bodyFields, true);
    }

    /**
     * @throws EndpointDeclarationInvalid
     */
    private function requirePathMatchesProperties(): void
    {
        preg_match_all('/\{(\w+)\}/', $this->endpoint->path, $placeholders);
        $named = $placeholders[1];
        sort($named);
        $declared = $this->pathProperties;
        sort($declared);

        if ($named !== $declared) {
            throw EndpointDeclarationInvalid::for($this->call, 'each path placeholder needs one #[InPath] property of its name');
        }

        if ($this->needsReceipt() && ! $this->hasRequestKey()) {
            throw EndpointDeclarationInvalid::for($this->call, 'a keyed write carries request_key');
        }
    }

    /**
     * The name a mapped property is read under: the name the mapping gives, or the property's own when it maps by a
     * mapper.
     */
    private static function inputName(int|string|NameMapper $input, string $property): string
    {
        return (string) ($input instanceof NameMapper ? $input->map($property) : $input);
    }
}
