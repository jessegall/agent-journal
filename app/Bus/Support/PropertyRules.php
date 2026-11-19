<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\CommandDeclarationInvalid;
use Illuminate\Support\Arr;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;
use Spatie\LaravelData\Attributes\Validation\ActiveUrl;
use Spatie\LaravelData\Attributes\Validation\Confirmed;
use Spatie\LaravelData\Attributes\Validation\CurrentPassword;
use Spatie\LaravelData\Attributes\Validation\Dimensions;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Image;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\MimeTypes;
use Spatie\LaravelData\Attributes\Validation\StringValidationAttribute;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Support\Validation\References\FieldReference;
use Spatie\LaravelData\Support\Validation\RuleDenormalizer;
use Spatie\LaravelData\Support\Validation\ValidationPath;
use Spatie\LaravelData\Support\Validation\ValidationRule;
use Throwable;

/**
 * Reads the validation attributes on a command's properties into Laravel rules, the type rule first, and refuses an
 * attribute that could never work. It runs once per command at start-up.
 */
final readonly class PropertyRules
{
    /**
     * Rules that read the database, a file, the request or the network rather than the command's input.
     */
    private const array LOOKUP_RULES = [
        Exists::class,
        Unique::class,
        CurrentPassword::class,
        Confirmed::class,
        ActiveUrl::class,
        File::class,
        Image::class,
        Mimes::class,
        MimeTypes::class,
        Dimensions::class,
    ];

    /**
     * The Laravel rule that makes size rules count a value of each PHP type the way it reads.
     */
    private const array TYPE_RULES = [
        'string' => 'string',
        'int' => 'integer',
        'float' => 'numeric',
        'bool' => 'boolean',
        'array' => 'array',
    ];

    public function __construct(private RuleDenormalizer $denormalizer) {}

    /**
     * Each ruled property's Laravel rules, the type rule first; a property with no attribute has no entry.
     *
     * @param  ReflectionClass<object>  $command
     * @return array<string, list<string|object>>
     */
    public function of(ReflectionClass $command): array
    {
        $rules = [];

        foreach ($command->getProperties() as $property) {
            $this->refuseRulesInsideValue($command, $property, []);
            $attributes = $property->getAttributes(ValidationRule::class, ReflectionAttribute::IS_INSTANCEOF);

            if ($attributes === []) {
                continue;
            }

            $rules[$property->getName()] = [
                $this->typeRuleOf($command, $property),
                ...$this->rulesOf($command, $property, $attributes),
            ];
        }

        return $rules;
    }

    /**
     * @param  ReflectionClass<object>  $command
     */
    private function typeRuleOf(ReflectionClass $command, ReflectionProperty $property): string
    {
        $type = $property->getType();
        $name = $type instanceof ReflectionNamedType ? $type->getName() : '';

        if (enum_exists($name)) {
            $problem = "{$property->getName()} is the enum {$name}, whose cases already limit it; take its validation"
                .' attributes off';

            throw CommandDeclarationInvalid::for($command->getName(), $problem);
        }

        if (! isset(self::TYPE_RULES[$name])) {
            $problem = "{$property->getName()} holds the value {$name}, which checks itself in its factory; take its"
                .' validation attributes off';

            throw CommandDeclarationInvalid::for($command->getName(), $problem);
        }

        return self::TYPE_RULES[$name];
    }

    /**
     * @param  ReflectionClass<object>  $command
     * @param  list<ReflectionAttribute<ValidationRule>>  $attributes
     * @return list<string|object>
     */
    private function rulesOf(ReflectionClass $command, ReflectionProperty $property, array $attributes): array
    {
        $rules = [];

        foreach ($attributes as $attribute) {
            $this->refuseLookup($command, $property, $attribute->getName());
            $rule = $this->builtRule($command, $property, $attribute);
            $this->refuseUnknownFields($command, $property, $rule);
            array_push($rules, ...$this->denormalized($command, $property, $rule));
        }

        return $rules;
    }

    /**
     * @param  ReflectionClass<object>  $command
     */
    private function refuseLookup(ReflectionClass $command, ReflectionProperty $property, string $attribute): void
    {
        if (! in_array($attribute, self::LOOKUP_RULES, true)) {
            return;
        }

        $problem = "{$property->getName()} uses ".class_basename($attribute).', which reads the database, a file,'
            .' the request or the network; look it up in the handler instead';

        throw CommandDeclarationInvalid::for($command->getName(), $problem);
    }

    /**
     * @param  ReflectionClass<object>  $command
     * @param  ReflectionAttribute<ValidationRule>  $attribute
     */
    private function builtRule(
        ReflectionClass $command,
        ReflectionProperty $property,
        ReflectionAttribute $attribute,
    ): ValidationRule {
        try {
            return $attribute->newInstance();
        } catch (Throwable $failure) {
            throw CommandDeclarationInvalid::ruleUnreadable($command->getName(), $property->getName(), $failure);
        }
    }

    /**
     * @param  ReflectionClass<object>  $command
     * @return list<string|object>
     */
    private function denormalized(ReflectionClass $command, ReflectionProperty $property, ValidationRule $rule): array
    {
        try {
            return array_values($this->denormalizer->execute($rule, ValidationPath::create()));
        } catch (Throwable $failure) {
            throw CommandDeclarationInvalid::ruleUnreadable($command->getName(), $property->getName(), $failure);
        }
    }

    /**
     * A rule naming another field, such as RequiredWithout('brief'), names one of the command's own properties.
     *
     * @param  ReflectionClass<object>  $command
     */
    private function refuseUnknownFields(
        ReflectionClass $command,
        ReflectionProperty $property,
        ValidationRule $rule,
    ): void {
        if (! $rule instanceof StringValidationAttribute) {
            return;
        }

        foreach (Arr::flatten($rule->parameters()) as $parameter) {
            if (! $parameter instanceof FieldReference || $command->hasProperty($parameter->name)) {
                continue;
            }

            $problem = "{$property->getName()} names the field {$parameter->name}, which the command does not have";

            throw CommandDeclarationInvalid::for($command->getName(), $problem);
        }
    }

    /**
     * A value a command carries checks itself, so a validation attribute on one of its properties is never read.
     *
     * @param  ReflectionClass<object>  $command
     * @param  list<string>  $seen  the value classes already walked, so a value holding itself ends
     */
    private function refuseRulesInsideValue(ReflectionClass $command, ReflectionProperty $property, array $seen): void
    {
        $type = $property->getType();
        $name = $type instanceof ReflectionNamedType ? $type->getName() : '';

        if (! class_exists($name) || in_array($name, $seen, true)) {
            return;
        }

        foreach (new ReflectionClass($name)->getProperties() as $inside) {
            if ($inside->getAttributes(ValidationRule::class, ReflectionAttribute::IS_INSTANCEOF) !== []) {
                $problem = "{$property->getName()} holds {$name}, whose property {$inside->getName()} has a validation"
                    ." attribute that is never read; check it in {$name}'s factory";

                throw CommandDeclarationInvalid::for($command->getName(), $problem);
            }

            $this->refuseRulesInsideValue($command, $inside, [...$seen, $name]);
        }
    }
}
