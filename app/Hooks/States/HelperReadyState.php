<?php

declare(strict_types=1);

namespace App\Hooks\States;

/**
 * The bottom both helper roles share: every main agent rule holds, and neither has the main agent's outage bypass,
 * which the relay grants the main agent role alone. The policy guard of each helper's frozen access policy joins here.
 */
abstract class HelperReadyState extends MainAgentReadyState {}
