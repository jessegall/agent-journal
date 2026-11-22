<?php

declare(strict_types=1);

namespace Samples\NameSaysKind;

// @righteous DeclarationSaysKindDetector
final class TaskIndexLayout
{
}

// @sin DeclarationSaysKindDetector
enum OrderKind: string
{
    // @sin DeclarationSaysKindDetector
    case PickupKind = 'pickup';
    // @righteous DeclarationSaysKindDetector
    case Delivery = 'delivery';
}

final class Shipment
{
    // @sin DeclarationSaysKindDetector
    public const string KIND_LABEL = 'label';

    // @sin PropertySaysKindDetector
    public string $kind = '';

    // @righteous PropertySaysKindDetector
    public string $label = '';

    public function __construct(public string $type) {}

    // @sin DeclarationSaysKindDetector
    public function kindOf(string $name): string
    {
        // @sin NameSaysKindDetector
        $kindText = $name;

        // @sin NameSaysKindDetector
        return $kindText.$this->type;
    }

    // @righteous DeclarationSaysKindDetector
    public function typeOf(string $name): string
    {
        // @righteous NameSaysKindDetector
        $text = $name;

        return $text;
    }
}
