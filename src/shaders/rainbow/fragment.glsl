varying vec3 vPosition;

void main()
{
    // Final color
    gl_FragColor = vec4(vPosition, 1.0);
    // ...
}