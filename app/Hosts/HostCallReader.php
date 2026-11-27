<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Exceptions\HostCallUnreadable;
use Illuminate\Validation\ValidationException;
use JsonException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\DataConfig;

/**
 * Reads the body of a host's call into its Data strictly, as host protocol 1 says (rule 117): a field the Data does
 * not have, or one it needs that is missing, refuses the call by the field's name, at every depth, and a value its
 * validation does not take refuses it with every field's error.
 */
final readonly class HostCallReader
{
    public function __construct(private DataConfig $config) {}

    /**
     * @template T of Data
     *
     * @param  class-string<T>  $class
     * @return T
     */
    public function read(string $body, string $class, string $call): Data
    {
        try {
            $fields = json_decode($body, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $unreadable) {
            throw HostCallUnreadable::notJson($call, $unreadable->getMessage());
        }

        $this->checkFields(is_array($fields) ? $fields : [], $class, $call, '');

        try {
            return $class::validateAndCreate($fields);
        } catch (ValidationException $invalid) {
            throw HostCallUnreadable::invalid($call, $invalid->errors());
        }
    }

    /**
     * Reads the body as read() does once it is known to hold no more than the bytes.
     *
     * @template T of Data
     *
     * @param  class-string<T>  $class
     * @return T
     */
    public function readAtMost(string $body, int $byteLimit, string $class, string $call): Data
    {
        if (strlen($body) > $byteLimit) {
            throw HostCallUnreadable::tooLarge($call, strlen($body), $byteLimit);
        }

        return $this->read($body, $class, $call);
    }

    /**
     * @param  array<array-key, mixed>  $fields
     */
    private function checkFields(array $fields, string $class, string $call, string $path): void
    {
        $properties = [];

        foreach ($this->config->getDataClass($class)->properties as $property) {
            $name = $property->inputMappedName ?? $property->name;
            $properties[$name] = $property;
            $isNeeded = ! $property->type->isOptional && ! $property->type->isNullable && ! $property->hasDefaultValue;

            if ($isNeeded && ! array_key_exists($name, $fields)) {
                throw HostCallUnreadable::missingField($call, $path.$name);
            }
        }

        foreach ($fields as $name => $value) {
            $property = $properties[$name] ?? throw HostCallUnreadable::unknownField($call, $path.$name);
            $this->checkNested($property->type->dataClass, $value, $call, "{$path}{$name}.");
        }
    }

    /**
     * A nested Data, alone or as a list of them, is checked as its parent is.
     */
    private function checkNested(string|null $class, mixed $value, string $call, string $path): void
    {
        if ($class === null || ! is_array($value)) {
            return;
        }

        if (! array_is_list($value)) {
            $this->checkFields($value, $class, $call, $path);

            return;
        }

        foreach ($value as $index => $item) {
            $this->checkFields(is_array($item) ? $item : [], $class, $call, "{$path}{$index}.");
        }
    }
}
