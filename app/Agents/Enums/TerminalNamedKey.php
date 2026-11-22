<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * The keys a browser writer may send by name: the arrows, Home, End, the page keys, Tab and Shift+Tab, Escape,
 * Backspace, Delete and Ctrl with a letter. The host maps each to its terminal sequence in one place.
 */
enum TerminalNamedKey: string
{
    case Up = 'up';
    case Down = 'down';
    case Left = 'left';
    case Right = 'right';
    case Home = 'home';
    case End = 'end';
    case PageUp = 'page_up';
    case PageDown = 'page_down';
    case Tab = 'tab';
    case ShiftTab = 'shift_tab';
    case Escape = 'escape';
    case Backspace = 'backspace';
    case Delete = 'delete';
    case CtrlA = 'ctrl_a';
    case CtrlB = 'ctrl_b';
    case CtrlC = 'ctrl_c';
    case CtrlD = 'ctrl_d';
    case CtrlE = 'ctrl_e';
    case CtrlF = 'ctrl_f';
    case CtrlG = 'ctrl_g';
    case CtrlH = 'ctrl_h';
    case CtrlI = 'ctrl_i';
    case CtrlJ = 'ctrl_j';
    case CtrlK = 'ctrl_k';
    case CtrlL = 'ctrl_l';
    case CtrlM = 'ctrl_m';
    case CtrlN = 'ctrl_n';
    case CtrlO = 'ctrl_o';
    case CtrlP = 'ctrl_p';
    case CtrlQ = 'ctrl_q';
    case CtrlR = 'ctrl_r';
    case CtrlS = 'ctrl_s';
    case CtrlT = 'ctrl_t';
    case CtrlU = 'ctrl_u';
    case CtrlV = 'ctrl_v';
    case CtrlW = 'ctrl_w';
    case CtrlX = 'ctrl_x';
    case CtrlY = 'ctrl_y';
    case CtrlZ = 'ctrl_z';
}
