<?php

declare(strict_types=1);

namespace Samples\NameSaysKind;

// @righteous NameSaysKindDetector
final class TaskIndexLayout
{
}

// @sin NameSaysKindDetector
enum OrderKind: string
{
    // @sin NameSaysKindDetector
    case PickupKind = 'pickup';
    // @righteous NameSaysKindDetector
    case Delivery = 'delivery';
}

final class Shipment
{
    // @sin NameSaysKindDetector
    public const string KIND_LABEL = 'label';

    // @sin NameSaysKindDetector
    public string $kind = '';

    // @righteous NameSaysKindDetector
    public string $label = '';

    public function __construct(public string $type) {}

    // @sin NameSaysKindDetector
    public function kindOf(string $name): string
    {
        // @sin NameSaysKindDetector
        $kindText = $name;

        // @sin NameSaysKindDetector
        return $kindText.$this->type;
    }

    // @righteous NameSaysKindDetector
    public function typeOf(string $name): string
    {
        // @righteous NameSaysKindDetector
        $text = $name;

        return $text;
    }
}
