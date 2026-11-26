<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reflection\ReflectorFactory;
use App\Exceptions\CommandDeclarationInvalid;
use Illuminate\Support\Arr;
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

    public function __construct(private RuleDenormalizer $denormalizer, private ReflectorFactory $reflectors) {}

    /**
     * Each ruled property's Laravel rules, the type rule first; a property with no attribute has no entry.
     *
     * @param  Reflector<object>  $command
     * @return array<string, list<string|object>>
     */
    public function of(Reflector $command): array
    {
        $rules = [];

        foreach ($command->properties() as $property) {
            $this->refuseRulesInsideValue($command, $property, []);
            $attributes = $property->attributesImplementing(ValidationRule::class);

            if (count($attributes) === 0) {
                continue;
            }

            $rules[$property->name()] = [
                $this->typeRuleOf($command, $property),
                ...$this->rulesOf($command, $property, $attributes->entries()),
            ];
        }

        return $rules;
    }

    /**
     * @param  Reflector<object>  $command
     */
    private function typeRuleOf(Reflector $command, ReflectedProperty $property): string
    {
        $name = self::namedTypeOf($property);

        if (Reflector::exists($name) && $this->reflectors->make($name)->isEnum()) {
            $problem = sprintf(
                '%s is the enum %s, whose cases already limit it; take its validation attributes off',
                $property->name(),
                $name,
            );

            throw CommandDeclarationInvalid::for($command->name(), $problem);
        }

        if (! isset(self::TYPE_RULES[$name])) {
            $problem = sprintf(
                '%s holds the value %s, which checks itself in its factory; take its validation attributes off',
                $property->name(),
                $name,
            );

            throw CommandDeclarationInvalid::for($command->name(), $problem);
        }

        return self::TYPE_RULES[$name];
    }

    /**
     * @param  Reflector<object>  $command
     * @param  list<AttributeEntry<ValidationRule>>  $attributes
     * @return list<string|object>
     */
    private function rulesOf(Reflector $command, ReflectedProperty $property, array $attributes): array
    {
        $rules = [];

        foreach ($attributes as $attribute) {
            $this->refuseLookup($command, $property, $attribute->name());
            $rule = $this->builtRule($command, $property, $attribute);
            $this->refuseUnknownFields($command, $property, $rule);
            array_push($rules, ...$this->denormalized($command, $property, $rule));
        }

        return $rules;
    }

    /**
     * @param  Reflector<object>  $command
     */
    private function refuseLookup(Reflector $command, ReflectedProperty $property, string $attribute): void
    {
        if (! in_array($attribute, self::LOOKUP_RULES, true)) {
            return;
        }

        $problem = "{$property->name()} uses ".class_basename($attribute).', which reads the database, a file, the request or the network; look it up in the handler instead';

        throw CommandDeclarationInvalid::for($command->name(), $problem);
    }

    /**
     * A new build of the rule for each read: the denormalizer rewrites some rules, such as In, as it reads them.
     *
     * @param  Reflector<object>  $command
     * @param  AttributeEntry<ValidationRule>  $attribute
     */
    private function builtRule(
        Reflector $command,
        ReflectedProperty $property,
        AttributeEntry $attribute,
    ): ValidationRule {
        try {
            return $attribute->freshInstance();
        } catch (Throwable $failure) {
            throw CommandDeclarationInvalid::ruleUnreadable($command->name(), $property->name(), $failure);
        }
    }

    /**
     * @param  Reflector<object>  $command
     * @return list<string|object>
     */
    private function denormalized(Reflector $command, ReflectedProperty $property, ValidationRule $rule): array
    {
        try {
            return array_values($this->denormalizer->execute($rule, ValidationPath::create()));
        } catch (Throwable $failure) {
            throw CommandDeclarationInvalid::ruleUnreadable($command->name(), $property->name(), $failure);
        }
    }

    /**
     * A rule naming another field, such as RequiredWithout('brief'), names one of the command's own properties.
     *
     * @param  Reflector<object>  $command
     */
    private function refuseUnknownFields(Reflector $command, ReflectedProperty $property, ValidationRule $rule): void
    {
        if (! $rule instanceof StringValidationAttribute) {
            return;
        }

        foreach (Arr::flatten($rule->parameters()) as $parameter) {
            if (! $parameter instanceof FieldReference || $command->hasProperty($parameter->name)) {
                continue;
            }

            $problem = "{$property->name()} names the field {$parameter->name}, which the command does not have";

            throw CommandDeclarationInvalid::for($command->name(), $problem);
        }
    }

    /**
     * A value a command carries checks itself, so a validation attribute on one of its properties is never read.
     *
     * @param  Reflector<object>  $command
     * @param  list<string>  $seen  the value classes already walked, so a value holding itself ends
     */
    private function refuseRulesInsideValue(Reflector $command, ReflectedProperty $property, array $seen): void
    {
        $name = self::namedTypeOf($property);

        if (! Reflector::exists($name) || ! $this->reflectors->make($name)->isClass() || in_array($name, $seen, true)) {
            return;
        }

        foreach ($this->reflectors->make($name)->properties() as $inside) {
            if (count($inside->attributesImplementing(ValidationRule::class)) > 0) {
                $problem = sprintf(
                    "%s holds %s, whose property %s has a validation attribute that is never read; check it in %s's factory",
                    $property->name(),
                    $name,
                    $inside->name(),
                    $name,
                );

                throw CommandDeclarationInvalid::for($command->name(), $problem);
            }

            $this->refuseRulesInsideValue($command, $inside, [...$seen, $name]);
        }
    }

    /**
     * The one name of the property's declared type; empty for an untyped property or a union or intersection.
     */
    private static function namedTypeOf(ReflectedProperty $property): string
    {
        return $property->type()
            ->filter(fn ($type) => $type->isNamed())
            ->map(fn ($type) => $type->name())
            ->getOrElse('');
    }
}
